import React from "react";
import { Button } from "@heroui/react";

interface TrainButtonProps {
  onTrain: () => void;
  isLoading: boolean;
  error: Error | null;
}

const TrainButton = ({ onTrain, isLoading, error }: TrainButtonProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Button
        color="secondary"
        size="lg"
        isLoading={isLoading}
        onPress={onTrain}
        className="font-semibold"
      >
        {isLoading ? "Training Model..." : "Train RB Model"}
      </Button>

      {error && (
        <p className="text-red-500 text-sm">Training failed: {error.message}</p>
      )}
    </div>
  );
};

export default TrainButton;
