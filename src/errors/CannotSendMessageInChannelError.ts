class CannotSendMessageInChannelError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "CannotSendMessageInChannelError";
  }
}

export default CannotSendMessageInChannelError;
