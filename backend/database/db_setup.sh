#!/usr/bin/env bash


python -m backend.database.init_db
python -m backend.database.data_hydration.insert_data


echo '*****Database hydration complete!*****'