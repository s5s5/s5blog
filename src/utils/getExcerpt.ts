export function getExcerpt(body: string, length: number = 150) {
  return body.slice(0, length).replace(/[#*`]/g, "") + "...";
}
