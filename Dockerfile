FROM ubuntu:20.04

RUN apt-get update
RUN apt-get install librdkafka-dev -y

CMD [ "tail", "-f", "/dev/null" ]