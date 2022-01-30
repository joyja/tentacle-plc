class PID {
  contsructor({ P, I, D }) {
    this.P = P
    this.I = I
    this.D = D
  }
}
PID.persistentData = ['P', 'I', 'D']

module.exports = [PID]
