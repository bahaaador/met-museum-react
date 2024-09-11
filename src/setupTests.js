import '@testing-library/jest-dom'
import { global } from '@jest/globals'
global.matchMedia = global.matchMedia || function () {
  return {
    matches: false,
    addListener: function () {},
    removeListener: function () {},
  }
}