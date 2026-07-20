#!/usr/bin/env node
import { hashPassword } from '../src/auth.js'

const password = process.argv[2]
if (!password) {
  console.error('Usage: npm run hash-password -- "your-password"')
  process.exit(1)
}
console.log(hashPassword(password))
