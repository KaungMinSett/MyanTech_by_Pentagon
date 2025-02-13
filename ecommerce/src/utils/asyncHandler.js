export async function handleAsync(task, errorTask, errorMessage = 'Something went wrong', loading = true) {
    // this.loading = loading;
    try {
      const result = await task();
      return result;
    } catch (error) {
      if (errorTask) {
        await errorTask(error);
      }
      console.error(errorMessage, error);
      throw error;
    } finally {
    //   this.loading = false;
    }
  }