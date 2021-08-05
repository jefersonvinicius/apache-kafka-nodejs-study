FROM ubuntu:20.04

RUN apt-get update
RUN apt-get install librdkafka-dev curl -y

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash \
    && export NVM_DIR="$HOME/.nvm" \
    && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" \
    && nvm install v14.17.4 \
    && node -v \
    && npm -v \
    && npm install -g yarn \
    && yarn -v

CMD [ "tail", "-f", "/dev/null" ]