"use client";
import {
  Announcements,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  MeasuringStrategy,
  Modifier,
  PointerSensor,
  closestCenter,
  defaultDropAnimation,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useMemo, useRef, useState } from "react";

import { SortableTreeItem } from "./components";
import type { FlattenedItem, SensorContext, TreeItems } from "./types";
import {
  buildTree,
  flattenTree,
  getChildCount,
  getProjection,
  removeChildrenOf,
  removeItem,
  setProperty,
} from "./utilities";
import { Button } from "@/components/ui/button";
import { updateSkillList } from "./action";
import Swal from "sweetalert2";

const initialItems: TreeItems = [
  {
    id: "1",
    skill_name: "Skill 1",
    collapsed: false,
    children: [
      {
        id: "1.1",
        skill_name: "Sub-skill 1.1",
        collapsed: false,
        children: [],
      },
      {
        id: "1.2",
        skill_name: "Sub-skill 1.2",
        collapsed: false,
        children: [],
      },
    ],
  },
  {
    id: "2",
    skill_name: "Skill 2",
    collapsed: false,
    children: [],
  },
];

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

const dropAnimation: DropAnimation = {
  ...defaultDropAnimation,
  duration: 200,
};

interface Props {
  collapsible?: boolean;
  defaultItems?: TreeItems;
  indentationWidth?: number;
  indicator?: boolean;
  removable?: boolean;
  skill: TreeItems;
}

export function SortableTree({
  collapsible,
  defaultItems = initialItems,
  indicator,
  indentationWidth = 20,
  removable,
  skill,
}: Props) {
  const [items, setItems] = useState(() => skill);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [skillName, setSkillName] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{
    parentId: string | null;
    overId: string;
  } | null>(null);

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items);
    const collapsedItems = flattenedTree.reduce<string[]>(
      (acc, { children, collapsed, id }) =>
        collapsed && children.length ? [...acc, id] : acc,
      []
    );

    return removeChildrenOf(
      flattenedTree,
      activeId ? [activeId, ...collapsedItems] : collapsedItems
    );
  }, [activeId, items]);
  const projected =
    activeId && overId
      ? getProjection(
          flattenedItems,
          activeId,
          overId,
          offsetLeft,
          indentationWidth
        )
      : null;
  const sensorContext: SensorContext = useRef({
    items: flattenedItems,
    offset: offsetLeft,
  });
  const sensors = useSensors(
    useSensor(PointerSensor)
    // useSensor(KeyboardSensor, {
    //   coordinateGetter,
    // })
  );

  useEffect(() => {
    setIsClient(true); // Set state to true when component mounts
  }, []);

  const sortedIds = useMemo(
    () => flattenedItems.map(({ id }) => id),
    [flattenedItems]
  );
  const activeItem = activeId
    ? flattenedItems.find(({ id }) => id === activeId)
    : null;

  useEffect(() => {
    sensorContext.current = {
      items: flattenedItems,
      offset: offsetLeft,
    };
  }, [flattenedItems, offsetLeft]);

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        measuring={measuring}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {isClient && (
          <SortableContext
            items={sortedIds}
            strategy={verticalListSortingStrategy}
          >
            {flattenedItems.map(
              ({ id, children, collapsed, depth, skill_name }) => (
                <SortableTreeItem
                  seeMore={() => handleSeeMore(id)}
                  key={id}
                  id={id}
                  value={skill_name!}
                  depth={id === activeId && projected ? projected.depth : depth}
                  indentationWidth={indentationWidth}
                  indicator={indicator}
                  collapsed={Boolean(collapsed && children.length)}
                  onCollapse={
                    children.length ? () => handleCollapse(id) : undefined
                  }
                  onRemove={removable ? () => handleRemove(id) : undefined}
                />
              )
            )}
            <DragOverlay
              dropAnimation={dropAnimation}
              modifiers={indicator ? [adjustTranslate] : undefined}
            >
              {activeId && activeItem ? (
                <SortableTreeItem
                  id={activeId}
                  depth={activeItem.depth}
                  clone
                  childCount={getChildCount(items, activeId) + 1}
                  value={activeItem.skill_name!}
                  indentationWidth={indentationWidth}
                />
              ) : null}
            </DragOverlay>
          </SortableContext>
        )}
      </DndContext>
      <Button onClick={handleSave}>Save</Button>
    </div>
  );

  // Function to generate sequence strings
  function generateSequences(skills: any[], parentSequence: string = "") {
    skills.forEach((skill, index) => {
      const currentSequence = parentSequence
        ? `${parentSequence}.${index + 1}`
        : `${index + 1}`;
      skill.sequence = currentSequence;

      // Recursively generate sequences for children
      if (skill.children && skill.children.length > 0) {
        generateSequences(skill.children, currentSequence);
      }
    });
  }

  // Function to flatten the skills list
  function flattenSkills(skills: any[]) {
    const flattenedSkills: any[] = [];
    const stack = [...skills];

    while (stack.length > 0) {
      const skill = stack.pop();
      flattenedSkills.push(skill);

      if (skill.children && skill.children.length > 0) {
        stack.push(...skill.children);
      }
    }

    return flattenedSkills;
  }

  async function handleSave() {
    // generate sequences
    generateSequences(items);

    // // flatten the skills list
    const flattenedSkills = flattenSkills(items);

    const result = await updateSkillList(flattenedSkills);
    if (result) {
      if (result.status) {
        alert(result.message);
      } else {
        alert(result.message);
        return false;
      }
    }
  }

  function handleSeeMore(id: string) {
    //find all items with the same parent id
    const parent = flattenedItems.find((item) => item.id === id);

    console.log("handleSeeMore", { parent });

    Swal.fire({
      title: parent?.skill_name,
      html: `<input id="swal-input1" class="swal2-input" value="${parent?.skill_name}">`,
    });
  }

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    console.log("handleDragStart", { activeId });

    setActiveId(activeId.toString());
    setOverId(activeId.toString());

    const activeItem = flattenedItems.find(({ id }) => id === activeId);

    if (activeItem) {
      setSkillName(activeItem.skill_name!);
    }

    if (activeItem) {
      setCurrentPosition({
        parentId: activeItem.parentId,
        overId: activeId.toString(),
      });
    }

    document.body.style.setProperty("cursor", "grabbing");
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x);
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId(over?.id.toString() || null);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    resetState();

    if (projected && over) {
      const { depth, parentId } = projected;
      const clonedItems: FlattenedItem[] = JSON.parse(
        JSON.stringify(flattenTree(items))
      );
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
      const activeTreeItem = clonedItems[activeIndex];

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      const newItems = buildTree(sortedItems);

      console.log("handleDragEnd", { newItems });

      setItems(newItems);
    }
  }

  function handleDragCancel() {
    resetState();
  }

  function resetState() {
    setOverId(null);
    setActiveId(null);
    setOffsetLeft(0);
    setCurrentPosition(null);

    document.body.style.setProperty("cursor", "");
  }

  function handleRemove(id: string) {
    setItems((items) => removeItem(items, id));
  }

  function handleCollapse(id: string) {
    console.log("handleCollapse", { id });

    setItems((items) =>
      setProperty(items, id, "collapsed", (value) => {
        return !value;
      })
    );
  }
}

const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
    y: transform.y - 25,
  };
};
