FROM node:23-alpine3.19

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

WORKDIR /home/pokemon_task

RUN mkdir -p /home/pokemon_task
COPY package.json dist pokedex.txt .
RUN npm install

EXPOSE 3000

USER node

CMD ["node", "index.js"]