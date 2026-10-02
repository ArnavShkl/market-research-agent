# JioMausam rain pipeline (prototype v0.1)

Estimates rainfall from commercial microwave link (CML) signal levels and scores it against weather radar.

- Data: pycomlink example dataset: 500 CMLs, 1-minute TSL/RSL, 10–20 May 2018, coordinates anonymised; reference: DWD RADOLAN-YW radar.
- Steps: per-link rolling-std wet/dry detection (threshold = 1.12 × 80th percentile), constant baseline, Schleiss 2013 wet-antenna correction (1.5 dB max), ITU k–R relation, one scale factor fitted on days 1–3, evaluation on days 4–11.
- Outputs: `out/final_metrics.json` (accuracy and payout backtest), `out/export.json` (data embedded in the Control Room prototype).

```
pip install pycomlink xarray scipy netCDF4
python rain_pipeline.py
```
