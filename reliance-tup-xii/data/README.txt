JioMausam data pack
===================

Everything our numbers are built from, in its original public form and in files you can open in Excel.

START HERE
  JioMausam_Numbers_Workbook.xlsx
    Live formulas that recompute our key numbers from this data: the scale factor (1.17), the
    network correlation (0.95), the median link (0.88), the payout test (94.6% / 68% / 18%),
    the Kavach prices (Rs 208, 45, 52, 27), the 25-year stress test and the business case
    (Rs 12.5 crore, Rs 174 crore). Yellow cells are inputs: change them and everything updates.


GERMANY: THE RAIN-SENSING TEST
==============================

Source
  pycomlink example dataset. pycomlink is the open-source Python toolbox for rain from microwave
  links, developed at Karlsruhe Institute of Technology (KIT), Germany. BSD licence.
    Code and data:  https://github.com/pycomlink/pycomlink   (folder pycomlink/io/example_data)
    Also installed with:  pip install pycomlink
  The three files in germany/original/ are byte-for-byte identical to the copies in that repository.

  What it is: 500 real commercial microwave links from a mobile network in Germany, signal levels
  every minute, 10-20 May 2018, plus German Weather Service (DWD) RADOLAN-YW radar rainfall as the
  reference. Link coordinates in the file are shifted for anonymity (they place the network at
  57-58 N, 1-3 E, which is in the North Sea), so the pattern is real but the location is not.

germany/original/  (NetCDF files; open with Python xarray, or NASA's free Panoply viewer)
  example_cml_data.nc
      The tower links. For each of 500 links x 2 channels x 15,840 minutes:
      tsl = transmitted signal level (dBm), rsl = received signal level (dBm).
      Per link: frequency, polarization, length (km), coordinates of both towers.
      Missing values: tsl 255, rsl -99.9.
  example_path_averaged_reference_data.nc
      Radar rainfall averaged along each link's path, every 5 minutes (mm per 5 minutes).
      This is the "answer key" for each link.
  example_areal_reference_data.nc
      The radar rainfall map itself: 190 x 228 grid (about 1 km), every 5 minutes.
      Used for the street-level map comparison and the payout test.

germany/csv/  (made from the files above by our code; open in Excel)
  links.csv
      One row per link: length, frequencies, polarization, tower coordinates, the ITU coefficients
      a and b used to turn signal loss into rain, the wet threshold, the link's correlation with
      radar on the unseen days (r_unseen_days), and its rain totals.
  three_links_minute_by_minute.csv
      Every processing step, every minute, for three example links (best 118, typical 359,
      weak 33), channel 1: raw tsl and rsl, signal loss, 60-minute wobble, wet threshold,
      wet (1/0), dry baseline, wet-antenna correction, rain attenuation, rain rate.
  our_rain_hourly_mm_per_h.csv
      Our calibrated rain estimate, every hour (264 rows) for every link (500 columns).
  radar_along_links_hourly_mm_per_h.csv
      Radar rain along each link's path, same layout. Compare column by column with the file above.
  network_average_hourly.csv
      All links averaged, every hour: ours (before and after calibration) and radar.
      CORREL of the last 192 rows (the test period) = 0.953.
  payout_decisions_test_days.csv
      14,256 rows: one per 4 km square per test day (13-20 May). The wettest 3-hour window from our
      map and from radar. A square pays if that is at least the trigger (10 mm).

Period split
  Tuning days: 10-12 May 2018 (the one scale factor is fitted here).
  Test days:   13-20 May 2018 (every published score uses only these).


INDIA: PRICES AND STRESS TEST
=============================

Source
  IMD synoptic station reports, as archived in NOAA's Global Summary of the Day (public domain):
    https://noaa-gsod-pds.s3.amazonaws.com/{year}/{station}.csv
  Stations: 43003099999 Mumbai Santacruz, 42867099999 Nagpur Sonegaon, 42647099999 Ahmedabad.

india/india_daily_imd.csv
  27,103 days, 2000-2024. rain_mm = raw inches x 25.4; max_temp_C = (raw F - 32) x 5/9.
  Years with fewer than 330 reports, or fewer than 110 reports in June-September, are left out
  (none of the 25 years per city was dropped in the final set).


CODE THAT PRODUCED EVERYTHING
=============================
  prototype/pipeline/rain_pipeline.py   rain from the links, scoring, payout test
  prototype/india/india_layer.py        India trigger counts and prices
  prototype/india/stress_test.py        25-year stress test
  prototype/testlab/                    the same steps in JavaScript (JioMausam Test Lab)

  data/scripts/                         how this pack and the explainer PDF were built
                                        (make_csv.py, make_payout.py, make_xlsx.py, charts.py,
                                        build_numbers.py; folder paths refer to our working copy)
