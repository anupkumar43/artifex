"use server";

import { Separator } from "./ui/separator";
import { auth } from "~/server/auth";
import AWS from "aws-sdk";
import { env } from "~/env";
import DownloadRecentImage from "./download-recent-image";

const Recent = async () => {
  const serverSession = await auth();

  const s3 = new AWS.S3({
    accessKeyId: env.MY_AWS_ACCESS_KEY,
    secretAccessKey: env.MY_AWS_SECRET_KEY,
    region: env.MY_AWS_REGION,
  });

  const prefix = `${serverSession?.user.id}/`;

  const params = {
    Bucket: env.MY_AWS_BUCKET_NAME,
    Prefix: prefix,
    MaxKeys: 10,
  };

  const data = await s3.listObjectsV2(params).promise();

  const recentImage = (data.Contents ?? [])
    .sort((a, b) => {
      const dateA = new Date(a.LastModified ?? 0).getTime();
      const dateB = new Date(b.LastModified ?? 0).getTime();
      return dateB - dateA;
    })
    .map((item) => ({
      url: `https://${env.MY_AWS_BUCKET_NAME}.s3.${env.MY_AWS_REGION}.amazonaws.com/${item.Key}`,
      createdAt: item.LastModified ?? new Date(),
    }));

  return (
    <div className="flex w-full flex-col text-left">
      <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Recent Images
      </h3>
      <p className="text-muted-foreground text-sm">
        Download your most recent images.
      </p>
      <Separator className="my-2" />

      {recentImage?.length === 0 ? (
        <p className="text-muted-foreground text-sm">No recent image.</p>
      ) : (
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {recentImage.map((image) => (
            <div
              key={image.url}
              className="flex flex-col items-center gap-2 rounded-lg bg-white/10 p-3 shadow-sm backdrop-blur-sm"
            >
              <img
                src={image.url}
                alt="recent"
                className="h-48 w-full rounded-md object-contain"
              />
              <p className="text-center text-sm">
                From{" "}
                {new Date(image.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
              <DownloadRecentImage url={image.url} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recent;
