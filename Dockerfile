FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN chmod +x entrypoint.sh
RUN mkdir -p uploads
EXPOSE 3004
CMD ["sh", "entrypoint.sh"]
