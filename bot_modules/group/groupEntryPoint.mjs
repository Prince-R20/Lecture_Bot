export default function handleGroup(sock) {
    sock.ev.on("group-participants.update", async (update) => {
    console.log(update);
  });
}
