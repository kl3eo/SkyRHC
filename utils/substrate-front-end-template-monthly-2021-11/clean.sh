#!/bin/bash
sed -i "s/\/substrate-front-end-template//g" ./build/index.html
sed -i "s/\/substrate-front-end-template//g" build/static/js/2.*.chunk.js
sed -i "s/\/substrate-front-end-template//g" build/static/css/2.*.chunk.css
