import { kaiProfile } from "./profile";

export type IdentityId =
  | "seller"
  | "founder"
  | "software-builder"
  | "musician"
  | "workflow-designer"
  | "trainer";

export type IdentityIcon =
  | "briefcase"
  | "lightbulb"
  | "code"
  | "music"
  | "workflow"
  | "trainer";

export type KaiIdentity = {
  id: IdentityId;
  label: string;
  icon: IdentityIcon;
  description: string;
  cta?:
    | { kind: "link"; label: string; href: string }
    | { kind: "projects"; label: string };
};

export const kaiIdentities: readonly KaiIdentity[] = [
  {
    id: "seller",
    label: "Doanh nhân / Seller",
    icon: "briefcase",
    description:
      "Kai bắt đầu từ việc mua những món đồ mình thích, tự trải nghiệm rồi bán lại. Hiện tại, công việc chính là xây dựng một hệ thống mua bán MacBook cũ minh bạch và dễ sử dụng tại MBMC.",
    cta: { kind: "link", label: "Xem MBMC →", href: kaiProfile.projects.mbmc },
  },
  {
    id: "founder",
    label: "Nhà sáng lập",
    icon: "lightbulb",
    description:
      "Kai xây dựng MBMC, Auryes và 3288 như những sản phẩm sống: bắt đầu từ một nhu cầu thật, đưa ra ngoài đời, quan sát phản hồi rồi tiếp tục thiết kế.",
    cta: { kind: "projects", label: "Xem các dự án bên dưới ↓" },
  },
  {
    id: "software-builder",
    label: "Người xây phần mềm",
    icon: "code",
    description:
      "Kai dùng phần mềm để biến những quy tắc, quyết định và công việc lặp lại thành công cụ mà người khác có thể sử dụng mà không cần hiểu toàn bộ hệ thống phía sau.",
    cta: { kind: "link", label: "Xem Auryes →", href: kaiProfile.projects.auryes },
  },
  {
    id: "musician",
    label: "Nhạc sĩ",
    icon: "music",
    description:
      "Kai viết nhạc, chơi nhạc cụ và xây những trải nghiệm để người nghe có thể bước vào thế giới của từng bài hát.",
    cta: { kind: "link", label: "Đi tới 3288 →", href: kaiProfile.projects.project3288 },
  },
  {
    id: "workflow-designer",
    label: "Thiết kế quy trình",
    icon: "workflow",
    description:
      "Kai quan sát quy trình làm việc, tìm điểm gây chậm hoặc mất thông tin, rồi thiết kế lại thành quy trình rõ ràng hơn và có thể số hóa.",
    cta: { kind: "link", label: "Xem MBMC →", href: kaiProfile.projects.mbmc },
  },
  {
    id: "trainer",
    label: "Người đào tạo",
    icon: "trainer",
    description:
      "Kai quan sát cách mình học và làm, rồi biến chúng thành những bước rõ ràng để người khác có thể thử, nhận phản hồi và tiến bộ nhanh hơn trong bán hàng, đàm phán, âm nhạc và thể thao.",
  },
] as const;
