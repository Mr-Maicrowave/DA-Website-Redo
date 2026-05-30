#!/bin/bash
routes=(
  "/"
  "/programs/primary-school"
  "/programs/high-school"
  "/hsc-excellence"
  "/subjects/mathematics"
  "/subjects/english"
  "/subjects/science"
  "/subjects"
  "/why-choose-da"
  "/find-teacher"
  "/our-approach"
  "/learning-formats"
  "/rising-star-2024"
  "/interview"
  "/success-stories"
  "/reviews"
  "/appreciation-advice"
)

mkdir -p ./visual_review

for route in "${routes[@]}"; do
  filename=$(echo "$route" | sed 's/\//_/g')
  if [ "$filename" == "_" ]; then
    filename="home"
  else
    filename="${filename:1}"
  fi
  echo "Capturing $route to visual_review/${filename}.png"
  npx -y playwright screenshot --full-page "http://localhost:8080${route}" "./visual_review/${filename}.png" &
done

wait
echo "All screenshots captured."
