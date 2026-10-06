# I Swept 760,000 CKKS Parameter Sets So Researchers Don't Have To

*Fall 2024 — Software Developer co-op, National Research Council Canada*

**A 30-second primer.** Fully Homomorphic Encryption (FHE) lets you compute on data *without decrypting it* — you hand someone an encrypted spreadsheet, they run calculations on the ciphertexts, and hand you back an encrypted answer that decrypts to the correct result. They never see your data. OpenFHE, the open-source library I worked with, implements several FHE schemes — BFV and BGV for exact integer arithmetic, and **CKKS** for approximate numbers (think: decimals, machine learning, statistics). My team's target was CKKS, and that's what everything below is about.

For my Fall 2024 co-op at the National Research Council of Canada, I was the only programmer on a team of PhD researchers working on privacy-preserving computation. Their research uses CKKS — a homomorphic encryption scheme for approximate numbers, implemented in the [OpenFHE](https://github.com/openfheorg/openfhe-development) library. Before you can compute on encrypted data with CKKS, you have to commit to a parameter set: security level $\lambda$, ring dimension $N$, scaling modulus $\Delta$, first modulus $q_0$, multiplicative depth $L$, and target precision. The theory gives you formulas predicting how much precision a parameter set will deliver. The researchers needed to know what it *actually* delivers — across hundreds of thousands of combinations — and how fast each operation runs.

So I built the whole machine: the C++ extensions, the measurement pipeline, the database, the GUI, and the benchmarks.

## Part 1: The C++ contributions

### Random ciphertext generation

To benchmark anything, you need realistic test inputs: ciphertexts at *specific* multiplicative levels. OpenFHE doesn't ship a clean way to generate those, so I wrote a small C++ extension that plugs into OpenFHE's encoding module. Given a key pair, a plaintext range, and a target level, it produces a random ciphertext at exactly that level. Every measurement program in the pipeline uses it.

### Ciphertext inversion: Newton vs. Goldschmidt

Division doesn't exist in homomorphic encryption — you can't just divide two ciphertexts. So I implemented two classical iterative algorithms for computing $1/b$ on *encrypted* values:

- **Newton's method**: $z \leftarrow z(2 - bz)$, converging quadratically.
- **Goldschmidt's method**: a parallel-friendly variant that rescales toward $1$.

Both live in an inversion module I wrote, plus a small helper that normalizes inputs into the $(0, 2)$ range Goldschmidt requires, and a demo program showing how to use it. One detail I'm fond of: during development I decrypted the intermediate value at each iteration and printed it, so I could watch the approximation converge by hand. It's the kind of debugging you only do when you can't look inside the ciphertext.

## Part 2: The precision sweep — 760,000 parameter sets

### Generating the tables

A Python script computes the theoretical relationships between CKKS parameters and writes out the full grid: a bounds table of feasible ranges per security level, and the big parameter table itself — every combination of $(\lambda, \log_2 N, \log_2 \Delta, q_0, L)$ with its theoretical $\log_2$ precision.

### Measuring reality, one row at a time

For each row, a C++ measurement program builds the corresponding OpenFHE crypto context, generates random ciphertexts at every level pair up to the multiplicative depth, multiplies them, decrypts, and records the actual precision using the library's own precision readout. The shell script feeds rows in one at a time; the C++ binary takes a single row as arguments.

That "one row at a time" design wasn't the plan — it was the fix. My first version tried to batch rows through a single `CryptoContext`, and the context kept eating all available memory until the process died. I abandoned batching: the shell driver now feeds one row per invocation, memory is freed immediately after each measurement, and the sweep ran continuously for about two weeks. I also shipped a SQLite-backed twin of the same C++ binary so we could resume without re-parsing million-row CSVs — same row-at-a-time contract, just a different input source. We actually had a broader sweep in flight at the same time — $156{,}985$ rows spanning security levels $128$, $196$, and $256$ with $\log_2 N$ from $14$ to $17$ — but it was still running after two weeks, so the study narrowed down to the completed $\lambda = 128$ dataset: **$760{,}647$ measured rows** covering ring dimensions $\log_2 N = 14, 15, 16$.

### From CSV to a tool researchers can use

A million rows of CSV isn't something a researcher wants to grep through, so I turned the raw output into something usable:

- A Python script converts the results into a SQLite database.
- A filtering step keeps the **minimum** measured OpenFHE precision per unique parameter combination (the conservative number you'd actually trust).
- A Tkinter GUI (v2) that takes $\lambda$, $L$, and a target precision, then walks **two tracks in parallel** — theoretical `log2_precision` and measured `OpenFHE_precision` — cascading down to the cheapest feasible $(N, \Delta, q_0)$ row. Researchers used those settings when writing papers.

## Part 3: What the data says

### Measured precision beats theory — almost everywhere

![CKKS precision: measured vs theoretical](/blog/nrc-ckks/assets/precision-deviation.png)

Across all $760{,}647$ parameter sets at $\lambda = 128$:

- In **$98.8\%$** of cases, the measured OpenFHE precision exceeded the theoretical formula's prediction.
- Median gap: **$+7$ bits**. Mean: **$+6.2$ bits** (std $1.8$).
- Plot theoretical precision against measured precision and the story is immediate — almost the entire cloud sits **above** the $y = x$ line:

![Theory vs measured precision](/blog/nrc-ckks/assets/precision-theory-vs-measured.png)

The theoretical precision formula is conservative. Researchers picking parameters from theory alone were leaving $\sim 6$ bits of precision on the table — or equivalently, over-provisioning their parameters. The sweep table gives them empirically validated numbers instead.

### Benchmarking: relinearization is where multiplication spends its time

Using Google Benchmark ($20$ iterations per case, sweeping all ciphertext level pairs up to depth $L$), I timed the $8$ core CKKS operations — $1{,}390$ benchmark runs total:

![CKKS benchmark: median wall-clock time per operation](/blog/nrc-ckks/assets/benchmark-timings.png)

- Ciphertext–ciphertext multiplication: **$\sim 52\,\mathrm{ms}$** median.
- The same multiplication *without* relinearization (`EvalMultNoRelin`): **$\sim 3.4\,\mathrm{ms}$** — roughly **$15\times$ faster**.
- Add/subtract: $\sim 1.3$–$1.9\,\mathrm{ms}$. Ciphertext–plaintext operations: sub-millisecond.

Relinearization dominates multiplication cost. That's a concrete, citable tradeoff for circuit design: if your application can tolerate the larger post-multiplication ciphertexts, skipping relinearization buys you an order of magnitude.

## What I took away

I arrived as a math undergrad who'd written some C++. I left having:

- **Extended a real cryptographic library** — random ciphertext generation and two inversion algorithms, written against OpenFHE's internals (DCRTPoly, RNS-CKKS contexts, key switching).
- **Built a data pipeline that ran unattended for two weeks** — Python table generation → C++ measurement → SQLite → Tkinter GUI, $1\mathrm{M}+$ records.
- **Debugged a genuine systems problem** — a memory blowup in a cryptographic context, fixed by redesigning the data flow (row-at-a-time with immediate cleanup) instead of throwing hardware at it.
- **Shipped tooling that PhD researchers used** in their papers — the GUI turned a $760\mathrm{K}$-row database into something a non-programmer could query in seconds.
