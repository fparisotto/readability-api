build:
    docker build -t readability-api .

run:
    docker run --rm -it -p 3000:3000 -e PORT=3000 readability-api
