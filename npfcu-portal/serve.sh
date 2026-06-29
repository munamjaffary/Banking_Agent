#!/bin/bash
echo "NPFCU Portal - starting server..."
echo "Open http://localhost:8080 in your browser"
echo "Or directly open: file://$PWD/dist/index.html"
python3 -m http.server 8080 --directory "$PWD/dist"
