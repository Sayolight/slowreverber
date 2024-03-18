import { promisify } from "util";
import { exec } from "child_process";
import { parse } from "path";

import { logger } from "./logger";

const execAsync = promisify(exec);

export async function processAudio(
  inputFile: string,
  speed: number,
  reverb: number,
): Promise<any> {
  try {
    const fileData = {
      outputPath:
        parse(inputFile).dir + "/slowreverberbot_" + parse(inputFile).base,
      ext: parse(inputFile).ext,
      name: parse(inputFile).name,
      dir: parse(inputFile).dir,

      soxed_converted:
        parse(inputFile).dir + "/sox_" + parse(inputFile).name + ".wav",
      soxed_source: parse(inputFile).dir + "/sox_" + parse(inputFile).base,

      ffmpeg_reconverted:
        parse(inputFile).dir + "/reconverted_" + parse(inputFile).base,
    };

    let fileIsValid: boolean;
    logger.debug(`Processing audio file: ${inputFile}`);

    let inputFilePath = inputFile;
    try {
      logger.debug(`Checking if ${inputFile} is a valid sox file...`);
      const checkCmd = `soxi -t "${inputFile}"`;
      await execAsync(checkCmd);

      fileIsValid = true;
    } catch (error) {
      logger.debug(
        `${inputFile} is not a valid sox file. Converting with ffmpeg...`,
      );
      const ffmpegCmd = `ffmpeg -i "${inputFile}" -acodec pcm_s16le -ar 44100 -ac 2 -f wav - | sox -t wav - "${inputFile}.wav"`;
      await execAsync(ffmpegCmd);

      inputFilePath = `${inputFile}.wav`;
      logger.debug(`Created temporary file ${inputFilePath}`);

      fileIsValid = false;
    }

    const remixedFile: string = fileIsValid
      ? fileData.soxed_source
      : fileData.soxed_converted;
    logger.debug("Processing sound with sox...");
    const soxCmd = `sox "${inputFilePath}" "${remixedFile}" speed ${speed} reverb ${reverb}`;
    await execAsync(soxCmd);
    logger.debug("Finished processing sound with sox");

    const reconvertedFile: string = fileIsValid
      ? remixedFile
      : fileData.ffmpeg_reconverted;
    if (!fileIsValid) {
      logger.debug("Converting file to output format...");
      const ffmpegCmd = `ffmpeg -y -i "${remixedFile}" -qscale:a 2 "${reconvertedFile}"`;
      await execAsync(ffmpegCmd);
      logger.debug("Finished converting file to output format");
    }

    logger.debug(
      `Copying metadata from ${inputFile} to ${fileData.outputPath}`,
    );
    const copyMetadataCmd = `ffmpeg -i "${inputFile}" -i "${reconvertedFile}" -c copy -map_metadata 0 -map 1 -y "${fileData.outputPath}"`;
    await execAsync(copyMetadataCmd);
    logger.debug(
      `Finished copying metadata from ${inputFile} to ${fileData.outputPath}`,
    );

    logger.debug(`Finished processing audio file: ${inputFile}`);

    return fileData.outputPath;
  } catch (error) {
    logger.error(`Error processing audio file: ${inputFile}`);
    throw error;
  }
}
