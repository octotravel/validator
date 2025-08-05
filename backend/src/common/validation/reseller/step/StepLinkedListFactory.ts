import { DoublyLinkedList } from 'linked-list-typed';
import { Step } from './Step';

export class StepLinkedListFactory {
  public static create(steps: Step[]): DoublyLinkedList<Step> {
    const doubleLinkedList = new DoublyLinkedList();
    steps.map((step, index) => doubleLinkedList.addAt(index, step));

    return doubleLinkedList;
  }
}
