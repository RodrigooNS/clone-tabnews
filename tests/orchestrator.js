import retry from 'async-retry';

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 2000,
    });

    async function fetchStatusPage() {
      const response = await fetch('http://localhost:3000/api/v1/status');

      if (response.status !== 200) {
        console.log(
          `Failed to fetch status page - HTTP error ${response.status}`
        );
        throw Error;
      }
    }
  }
}

export default {
  waitForAllServices,
};
