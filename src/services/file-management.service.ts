/*!
 * Paradigm UI Web
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://gitlab.com/miracledevs-paradigm/ui-web-angularjs/blob/master/LICENSE)
 */

import { Service } from "../decorators/service";
import { ServiceBase } from "./base.service";
import { AngularServices } from "./angular.service";
import { ITimeoutService } from "angular";
import { ObjectExtensions, fileMimeType } from "@miracledevs/paradigm-ui-web-shared";

@Service({
    name: "$pd-fileManagementService",
    dependencies: [AngularServices.timeout]
})
export class FileManagementService extends ServiceBase
{
    constructor(private timeout: ITimeoutService)
    {
        super();
    }

    read(file: File, completed: (file: File, content: string) => void, progress?: (p: number) => void, error?: (e: string) => void): void
    {
        const reader = new FileReader();
        reader.onload = e => this.timeout(() => completed(file, btoa(e.target["result"])));

        if (!ObjectExtensions.isNull(progress))
            reader.onprogress = e =>
            {
                if (e.lengthComputable)
                {
                    const percentLoaded = Math.round((e.loaded / e.total) * 100);
                    progress(percentLoaded);
                }
            };

        if (!ObjectExtensions.isNull(error))
        {
            reader.onabort = (e) => error(this.getError(e));
            reader.onerror = (e) => error(this.getError(e));
        }

        reader.readAsBinaryString(file);
    }

    download(fileName: string, content: string): void
    {
        const a = window.document.createElement("a") as any;

        a.href = window.URL.createObjectURL(this.getBlob(fileName, content));
        a.download = fileName;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    open(fileName: string, content: string): void
    {
        const blob = this.getBlob(fileName, content);

        if (window.navigator && window.navigator.msSaveOrOpenBlob)
        {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        }
        else
        {
            const url = window.URL.createObjectURL(blob);
            window.open(url);
        }
    }

    getBlobUrl(fileName: string, content: string): string
    {
        return window.URL.createObjectURL(this.getBlob(fileName, content));
    }

    private getBlob(fileName: string, content64: string): Blob
    {
        const content = atob(content64);
        const byteArray = new Uint8Array(content.length);

        for (let i = 0; i < byteArray.length; i++)
            byteArray[i] = content.charCodeAt(i);

        return new Blob([byteArray], { type: fileMimeType.get(fileName) });
    }

    private getError(e: Event): string
    {
        switch (e.target["error"].code)
        {
            case e.target["error"].NOT_FOUND_ERR:
                return "File not found.";

            case e.target["error"].NOT_READABLE_ERR:
                return "File is not readable.";

            case e.target["error"].ABORT_ERR:
                return "Read operation was aborted.";

            case e.target["error"].SECURITY_ERR:
                return "File is in a locked state.";

            case e.target["error"].ENCODING_ERR:
                return "The file is too long to encode.";

            default:
                return "Can not read the file.";
        }
    }

    static factory(timeout: ITimeoutService): FileManagementService
    {
        return new FileManagementService(timeout);
    }
}