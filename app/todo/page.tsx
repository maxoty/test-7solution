import FruitVegetableTodo from "@/components/fruit-vegetable-todo";
import ProfileLayout from "@/components/profile-layout";

export default function Todo() {
  return (
    <ProfileLayout activeTab="todo">
      <FruitVegetableTodo />
    </ProfileLayout>
  );
}
