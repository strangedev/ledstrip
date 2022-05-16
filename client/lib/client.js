import axios from 'axios';

const printError = (err) => err.message;

const handleHttpError = async (executor) => {
  try {
    return await executor();
  } catch (err) {
    if (err.response) {
      throw new Error(`Received ${err.response.status}:\n${printError(err)}`);
    } else if (err.request) {
      throw new Error(`Unable to perform request:\n${printError(err)}`);
    } else {
      throw err;
    }
  }
}

const getClient = (address, protocol='http') => {
  const getRouteUrl = (route) => `${protocol}://${address}${route}`;

  return {
    async cancelAnimation() {
      try {
        await axios.post(
          getRouteUrl('/animation/stop')
        );
      } catch {
        // Intentionally left blank.
      }
    },
    async startAnimation(animation) {
      return handleHttpError(async () =>
        await axios.post(
          getRouteUrl('/animation/start'),
          animation
        )
      );
    },
    async stopAninmation() {
      return handleHttpError(async () =>
        await axios.post(
          getRouteUrl('/animation/stop')
        )
      );
    }
  };
};

export {
  getClient
};
