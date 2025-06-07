let sock = null;

export function setSock(instance) {
  sock = instance;
}

export function getSock() {
  if (!sock) {
    throw new Error(
      "Socket instance is not set. Please set it using setSock() method."
    );
  }
  return sock;
}
