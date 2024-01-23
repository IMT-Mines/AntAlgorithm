/**
 * Random number generator based on linear congruential generator
 * https://en.wikipedia.org/wiki/Linear_congruential_generator
 */
class RandomNumberGenerator {

    static seed = Date.now(); // if no seed is provided, use current time
    static factor = 1664525;
    static offset = 1013904223;
    static range = Math.pow(2, 32);

    static setSeed(seed) {
        RandomNumberGenerator.seed = seed;
    }

    static next() {
        RandomNumberGenerator.seed = (RandomNumberGenerator.factor * RandomNumberGenerator.seed + RandomNumberGenerator.offset) % RandomNumberGenerator.range;
        return RandomNumberGenerator.seed / RandomNumberGenerator.range;
    }

}