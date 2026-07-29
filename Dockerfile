# Use Playwright's official image - comes with browsers and OS deps pre-installed
FROM mcr.microsoft.com/playwright:v1.62.0-noble

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy the rest of the project
COPY . .

# Default command runs all Playwright tests
CMD ["npx", "playwright", "test"]   