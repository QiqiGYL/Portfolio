"""Generate the three NRC blog charts from local DBs + GitHub benchmark CSVs."""
from __future__ import annotations

import csv
import io
import sqlite3
import urllib.request
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "blog" / "nrc-ckks" / "assets"
OUT.mkdir(parents=True, exist_ok=True)

DB = Path(r"C:\Users\grace\Downloads\big_table_128_precision_final1.db")
BENCH_URL = (
    "https://raw.githubusercontent.com/QiqiGYL/NRC_Coop/build/benchmark_full_output.csv"
)

# Match portfolio palette
GREEN = "#1f6f5b"
FOG_BLUE = "#6d8ea3"
INK = "#121a16"
MUTED = "#5c6b62"
PAPER = "#f1f6f2"


def style():
    plt.rcParams.update(
        {
            "font.family": "DejaVu Sans",
            "axes.facecolor": PAPER,
            "figure.facecolor": "white",
            "axes.edgecolor": "#c5d0c8",
            "axes.labelcolor": INK,
            "xtick.color": MUTED,
            "ytick.color": MUTED,
            "text.color": INK,
            "axes.grid": True,
            "grid.color": "#d7e0da",
            "grid.linewidth": 0.7,
            "axes.spines.top": False,
            "axes.spines.right": False,
        }
    )


def load_precision():
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    tables = cur.execute(
        "SELECT name FROM sqlite_master WHERE type='table'"
    ).fetchall()
    table = tables[0][0]
    cols = [r[1] for r in cur.execute(f"PRAGMA table_info({table})")]
    print("table", table, "cols", cols)
    # Prefer filtered uniqueness if raw has level columns
    rows = cur.execute(
        f"""
        SELECT log2_N, log2_precision, OpenFHE_precision
        FROM {table}
        WHERE log2_precision IS NOT NULL AND OpenFHE_precision IS NOT NULL
        """
    ).fetchall()
    conn.close()
    print("rows", len(rows))
    return rows


def chart_deviation(rows):
    gaps = np.array([o - t for _, t, o in rows], dtype=float)
    pct_above = 100.0 * np.mean(gaps > 0)
    median = float(np.median(gaps))
    mean = float(np.mean(gaps))
    std = float(np.std(gaps))
    print(
        f"gap stats: n={len(gaps)} above={pct_above:.1f}% "
        f"median={median:.2f} mean={mean:.2f} std={std:.2f}"
    )

    fig, ax = plt.subplots(figsize=(8.2, 4.6), dpi=160)
    bins = np.arange(np.floor(gaps.min()) - 0.5, np.ceil(gaps.max()) + 1.5, 1)
    ax.hist(gaps, bins=bins, color=GREEN, edgecolor="white", linewidth=0.4, alpha=0.9)
    ax.axvline(0, color=MUTED, linestyle="--", linewidth=1.2, label="theory = measured")
    ax.axvline(median, color=FOG_BLUE, linewidth=1.8, label=f"median +{median:.0f} bits")
    ax.set_xlabel("Measured − theoretical precision (bits)")
    ax.set_ylabel("Parameter sets")
    ax.set_title("CKKS precision: measured vs theoretical (λ = 128)")
    ax.legend(frameon=False)
    fig.tight_layout()
    fig.savefig(OUT / "precision-deviation.png")
    plt.close(fig)


def chart_theory_vs_measured(rows):
    """Density of theoretical vs measured precision — mass above y=x sells the claim."""
    theory = np.array([t for _, t, _ in rows], dtype=float)
    measured = np.array([o for _, _, o in rows], dtype=float)
    above = float(np.mean(measured > theory) * 100)
    print(f"theory-vs-measured: n={len(theory)} above y=x: {above:.1f}%")

    lo = float(min(theory.min(), measured.min()))
    hi = float(max(theory.max(), measured.max()))
    pad = 1.0
    extent = (lo - pad, hi + pad)

    fig, ax = plt.subplots(figsize=(8.2, 6.2), dpi=160)
    ax.set_facecolor("#f7faf8")
    fig.patch.set_facecolor("white")

    hb = ax.hexbin(
        theory,
        measured,
        gridsize=42,
        mincnt=1,
        bins="log",
        cmap="Greens",
        linewidths=0.15,
        edgecolors="white",
        extent=(extent[0], extent[1], extent[0], extent[1]),
    )
    diag = np.linspace(extent[0], extent[1], 100)
    ax.plot(diag, diag, color="#3d4f5f", linestyle="--", linewidth=1.5, label="measured = theory")
    ax.legend(frameon=False, loc="upper left")

    cb = fig.colorbar(hb, ax=ax, pad=0.02)
    cb.set_label("log₁₀(count)")

    ax.set_xlabel("Theoretical precision (bits)")
    ax.set_ylabel("Measured OpenFHE precision (bits)")
    ax.set_title(r"Theory vs measured precision ($\lambda=128$, $n=760{,}647$)")
    ax.set_aspect("equal", adjustable="box")
    ax.set_xlim(extent)
    ax.set_ylim(extent)
    ax.text(
        0.98,
        0.04,
        f"{above:.1f}% of points above the line",
        transform=ax.transAxes,
        ha="right",
        va="bottom",
        color=GREEN,
        fontsize=10,
        fontweight="bold",
        bbox={"boxstyle": "round,pad=0.35", "facecolor": "white", "edgecolor": "#d7e0da", "alpha": 0.92},
    )
    fig.tight_layout()
    fig.savefig(OUT / "precision-theory-vs-measured.png")
    plt.close(fig)

    # Drop the old ring-dimension figure if present
    old = OUT / "precision-by-ringdim.png"
    if old.exists():
        old.unlink()


def load_benchmark():
    with urllib.request.urlopen(BENCH_URL, timeout=60) as resp:
        text = resp.read().decode("utf-8", errors="replace")
    reader = csv.DictReader(io.StringIO(text))
    rows = list(reader)
    print("benchmark rows", len(rows), "fields", reader.fieldnames)
    return rows, reader.fieldnames


def parse_time_ms(raw: str) -> float | None:
    if raw is None:
        return None
    s = str(raw).strip().lower()
    if not s:
        return None
    # Values like "1270 us" or "52.1 ms"
    parts = s.split()
    try:
        if len(parts) == 1:
            return float(parts[0])  # assume ms
        value = float(parts[0])
        unit = parts[1]
        if unit.startswith("ns"):
            return value / 1e6
        if unit.startswith("us") or unit.startswith("µs"):
            return value / 1e3
        if unit.startswith("ms"):
            return value
        if unit.startswith("s"):
            return value * 1e3
        return value
    except ValueError:
        return None


def chart_benchmark(rows, fields):
    # Normalize field names (CSV has trailing spaces)
    clean_fields = [f.strip() if f else f for f in fields]
    field_map = {f.strip(): f for f in fields if f}

    name_key = field_map.get("Function_name") or field_map.get("name")
    time_key = field_map.get("real_time")
    if not name_key or not time_key:
        raise SystemExit(f"Could not parse benchmark CSV columns: {clean_fields}")

    buckets: dict[str, list[float]] = {}
    for r in rows:
        name = (r.get(name_key) or "").strip()
        t_ms = parse_time_ms(r.get(time_key))
        if t_ms is None:
            continue
        label = simplify_op(name)
        if label:
            buckets.setdefault(label, []).append(t_ms)

    order = [
        ("Add", "Add"),
        ("Sub", "Sub"),
        ("Mult", "Mult"),
        ("MultRelin", "Mult + relin"),
        ("MultNoRelin", "Mult no relin"),
        ("AddPlain", "Add plaintext"),
        ("SubPlain", "Sub plaintext"),
        ("MultPlain", "Mult plaintext"),
    ]
    keys = [k for k, _ in order if k in buckets]
    display = {k: d for k, d in order}
    labels = [display[k] for k in keys]
    medians = [float(np.median(buckets[k])) for k in keys]
    for k, m in zip(keys, medians):
        print(f"  {k}: median {m:.3f} ms (n={len(buckets[k])})")

    fig, ax = plt.subplots(figsize=(8.6, 4.8), dpi=160)
    colors = [FOG_BLUE if k == "MultNoRelin" else GREEN for k in keys]
    bars = ax.barh(labels[::-1], medians[::-1], color=colors[::-1], height=0.62)
    for bar, val in zip(bars, medians[::-1]):
        ax.text(
            bar.get_width() + max(medians) * 0.02,
            bar.get_y() + bar.get_height() / 2,
            f"{val:.2f} ms",
            va="center",
            ha="left",
            fontsize=9,
            color=MUTED,
        )
    ax.set_xlabel("Median wall-clock time (ms)")
    ax.set_title("CKKS benchmark: median time per operation")
    ax.set_xlim(0, max(medians) * 1.28 if medians else 1)
    fig.tight_layout()
    fig.savefig(OUT / "benchmark-timings.png")
    plt.close(fig)


def simplify_op(name: str) -> str | None:
    n = name.lower().replace(" ", "").replace("-", "")
    if not n or n.startswith("#"):
        return None
    checks = [
        ("multnorelin", "MultNoRelin"),
        ("ckksrns_multnorelin", "MultNoRelin"),
        ("multrelin", "MultRelin"),
        ("ckksrns_multrelin", "MultRelin"),
        ("mult_plaintext", "MultPlain"),
        ("multplaintext", "MultPlain"),
        ("add_plaintext", "AddPlain"),
        ("addplaintext", "AddPlain"),
        ("sub_plaintext", "SubPlain"),
        ("subplaintext", "SubPlain"),
        ("ckksrns_mult", "Mult"),
        ("ckksrns_add", "Add"),
        ("ckksrns_sub", "Sub"),
    ]
    for key, label in checks:
        if key in n:
            return label
    if "plaintext" in n and "mult" in n:
        return "MultPlain"
    if "plaintext" in n and "add" in n:
        return "AddPlain"
    if "plaintext" in n and "sub" in n:
        return "SubPlain"
    if "mult" in n:
        return "Mult"
    if "add" in n:
        return "Add"
    if "sub" in n:
        return "Sub"
    return None


def main():
    style()
    rows = load_precision()
    chart_deviation(rows)
    chart_theory_vs_measured(rows)
    bench_rows, fields = load_benchmark()
    chart_benchmark(bench_rows, fields)
    print("wrote charts to", OUT)


if __name__ == "__main__":
    main()
