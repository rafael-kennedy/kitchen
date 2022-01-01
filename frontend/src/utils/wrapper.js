import { ElNotification } from "element-plus";

export async function asyncErrorWrapper(
  {
    title = "Error",
    messageFn = (message) =>
      `${
        message || "Sorry, there was an error."
      } Please contact support@friendly.kitchen if you need assistance.`,
  },
  call
) {
  let result, error;

  try {
    result = await call;
  } catch (err) {
    error = err;
  }

  if (error) {
    console.error(error);
    const outputMessage = messageFn(error.message);
    ElNotification({
      title,
      message: outputMessage,
      type: "error",
    });
    return { error };
  } else {
    return result;
  }
}
