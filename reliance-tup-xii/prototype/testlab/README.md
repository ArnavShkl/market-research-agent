# JioMausam Test Lab

A browser re-run of our tests on the real data: `prototype/JioMausam_Test_Lab_standalone.html` (works offline; data and fonts embedded).

- `engine.js`: JavaScript port of `pipeline/rain_pipeline.py`, including the pycomlink steps (wet/dry detection, constant baseline, Schleiss 2013 wet-antenna correction, ITU-R k-R relation), the IDW map and the payout backtest.
- `india.js`: port of `india/india_layer.py` pricing and `india/stress_test.py`.
- `export_lab.py`, `export_india.py`: write the data files the page runs on (500 links x 2 channels x 15,840 minutes; radar; 25 years of IMD station reports).
- `build_lab.py`: assembles the page from `template.html`.
- `test_engine.js`, `test_india.js`: check the JavaScript against the Python results. With the published settings, all 132,000 hourly rain values agree with the Python run (largest difference 2e-14), and every accuracy, price and stress-test number matches.

```
python3 export_lab.py && python3 export_india.py   # needs pycomlink and the GSOD files from india_layer.py
node test_engine.js && node test_india.js
python3 build_lab.py
```
