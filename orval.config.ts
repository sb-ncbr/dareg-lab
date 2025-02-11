import { defineConfig } from 'orval';

export default defineConfig({
    dareg: {
        input: 'http://localhost:8000/api/schema/',
        output: {
            target:'./src/api.ts',
            client: "react-query",
            baseUrl: "http://localhost:8000/"
        },
    },
});