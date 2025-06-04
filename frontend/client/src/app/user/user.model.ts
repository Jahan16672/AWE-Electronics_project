// src/app/user/user.model.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'staff' | 'manager';
}

export class Customer implements User {
  role: 'customer' = 'customer';
  constructor(public id: number, public name: string, public email: string) {}
}

export class Staff implements User {
  role: 'staff' = 'staff';
  constructor(public id: number, public name: string, public email: string) {}

}
