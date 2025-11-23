FROM node:24-alpine

ENV LANG=C.UTF-8
ARG APP_DIR=/app
WORKDIR $APP_DIR

# I hate the python package cause it becames as python3 instead of python
RUN apk add --no-cache python3 make g++ git python3-dev \
    && ln -sf /usr/bin/python3 /usr/bin/python

COPY package*.json ./
RUN npm install
COPY node_modules ./node_modules

COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

COPY . .

RUN npm install --omit=dev

CMD ["./entrypoint.sh"]
