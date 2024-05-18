import { promisify } from "util";
import { exec } from "child_process";
import { parse, join } from "path";
import { logger } from "./logger";

const execAsync = promisify(exec);

export async function processAudio(
  inputFile: string,
  speed: number,
  reverb: number
): Promise<string> {
  try {
    const { dir, name, base } = parse(inputFile);

    const fileData = {
      outputPath: join(dir, `slowreverberbot_${base}`),
      soxedConverted: join(dir, `sox_${name}.wav`),
      ffmpegReconverted: join(dir, `reconverted_${base}`)
    };

    logger.debug(`Processing audio file: ${inputFile}`);

    const tempWavFile = await convertToWav(inputFile);
    logger.debug(`Created temporary file ${tempWavFile}`);

    await processWithSox(tempWavFile, fileData.soxedConverted, speed, reverb);
    logger.debug("Finished processing sound with sox");

    await convertToOutputFormat(fileData.soxedConverted, fileData.ffmpegReconverted);
    logger.debug("Finished converting file to output format");

    await copyMetadata(inputFile, fileData.ffmpegReconverted, fileData.outputPath);
    logger.debug(`Finished copying metadata to ${fileData.outputPath}`);

    logger.debug(`Finished processing audio file: ${inputFile}`);
    return fileData.outputPath;
  } catch (error) {
    logger.error(`Error processing audio file: ${inputFile}`, error);
    throw error;
  }
}

async function convertToWav(inputFile: string): Promise<string> {
  const ffmpegCmd = `ffmpeg -i "${inputFile}" -acodec pcm_s16le -ar 44100 -ac 2 -f wav - | sox -t wav - "${inputFile}.wav"`;
  await execAsync(ffmpegCmd);
  return `${inputFile}.wav`;
}

async function processWithSox(inputFile: string, outputFile: string, speed: number, reverb: number): Promise<void> {
  const soxCmd = `sox "${inputFile}" "${outputFile}" speed ${speed} reverb ${reverb}`;
  await execAsync(soxCmd);
}

async function convertToOutputFormat(inputFile: string, outputFile: string): Promise<void> {
  const ffmpegConvertCmd = `ffmpeg -y -i "${inputFile}" -qscale:a 2 "${outputFile}"`;
  await execAsync(ffmpegConvertCmd);
}

async function copyMetadata(sourceFile: string, tempFile: string, outputFile: string): Promise<void> {
  const copyMetadataCmd = `ffmpeg -i "${sourceFile}" -i "${tempFile}" -c copy -map_metadata 0 -map 1 -y "${outputFile}"`;
  await execAsync(copyMetadataCmd);
}
