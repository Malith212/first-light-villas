import { Button } from "antd";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen gap-5">
      <h1 className="text-4xl text-gray-500 font-bold uppercase">First-Light</h1>
      <Button type="primary">Primary</Button>
      <Button type="link">Link</Button>
      <Button type="text">Text</Button>
    </div>
  );
}
 