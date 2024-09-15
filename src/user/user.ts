/**
 * 賭客 Class
 * TODO: 也許會單獨使用 User Service Access DB.
 */
class User {
    
  id: string | null = null;

  constructor(id: string) {
    this.id = id;
  }

  getTotalBalance() {
    return 0;
  }

  getLockedBalance() {
    return 0;
  }

  getAvailableBalance() {
    return 0;
  }

  lockedBalance(amount: number) {
    return 0;
  }

  unlockedBalance(amount: number) {
    
  }

  deposit(amount: number) {

  }

  withdraw(amount: number) {

  }

  setBalance() { }

}

export default User;
