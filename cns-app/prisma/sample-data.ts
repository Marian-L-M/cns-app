import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

const sampleData = {
  users: [
    {
      name: `Schmohn`,
      email: `admin@test.com`,
      password: bcrypt.hashSync("bockwurst123", 10),
      role: Role.ADMIN,
    },
    {
      name: `Tonibert`,
      email: `normale@test.com`,
      password: bcrypt.hashSync("bockwurst123", 10),
      role: Role.USER,
    },
  ],
};

export default sampleData;
