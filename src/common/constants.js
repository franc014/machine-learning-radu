const constants = {};

constants.PUBLIC_DIR = "../../public";
console.log(constants.PUBLIC_DIR);
constants.DATA_DIR = "../data";
constants.RAW_DIR = constants.DATA_DIR + "/raw";
constants.DATASET_DIR = constants.DATA_DIR + "/dataset";
constants.JSON_DIR = constants.DATASET_DIR + "/json";
constants.IMG_DIR = constants.PUBLIC_DIR + "/data/img";

constants.SAMPLES = constants.DATASET_DIR + "/samples.json";
constants.JS_OBJECTS = "../common/js_objects";
constants.SAMPLES_JS = constants.JS_OBJECTS + "/samples.js";

export default constants;
