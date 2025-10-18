import StyleDictionary from 'style-dictionary';
import config from './style-dictionary.config.cjs';

const SD = StyleDictionary.extend(config);
SD.buildAllPlatforms();
