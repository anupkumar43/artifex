"use client";

import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const recentPics = [
  {
    url: "/style1.png",
    createdAt: new Date("2024-06-01"),
  },
  {
    url: "/style2.png",
    createdAt: new Date("2024-06-15"),
  },
  {
    url: "/style3.png",
    createdAt: new Date("2024-06-20"),
  },
];

const Recent = () => {
  return (
    <div className="flex flex-col">
      <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Recent pictures
      </h3>
      <p className="text-muted-foreground text-sm">
        Download your most recent pictures.
      </p>
      <Separator className="my-2" />
      {recentPics.length === 0 ? (
        <p className="text-muted-foreground text-sm">No recent picture.</p>
      ) : (
        <div className="flex h-fit max-w-full gap-4 overflow-x-auto">
          {recentPics.map((pics) => (
            <div key={pics.url} className="flex min-w-fit flex-col gap-2">
              <img
                src={pics.url}
                alt="image"
                className="h-56 w-auto rounded-lg border object-contain"
              />
              <p className="text-muted-foreground text-sm">
                From{" "}
                {new Date(pics.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
              <Button
                variant="secondary"
                className="text-xs"
                onClick={() => alert("Dummy download triggered")}
              >
                Download
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recent;
