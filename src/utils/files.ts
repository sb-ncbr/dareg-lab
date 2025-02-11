import File from "../types/files/FileEntry.ts";

type FilterConditionally<Source, Condition> = Pick<Source, {[K in keyof Source]: Source[K] extends Condition ? K : never}[keyof Source]>;

type FileKey = keyof FilterConditionally<File, number>;

export const reduceFileSize = (key: FileKey, files: File[]) => {
    return files.reduce((acc, file) => acc + file[key], 0);
}