export default class Cache {
  requests = {}

  getRequest(key) {
    return this.requests[key]
  }

  addRequest(key, payload) {
    this.requests[key] = payload
  }
}
