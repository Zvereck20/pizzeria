import { useMemo, useState, type FC } from "react";
import { Autocomplete, Box, Button, Stack, TextField, Typography } from "@mui/material";
import type { Ingredient } from "@/features";

interface ProductIngredientsEditorProps {
  ingredients: Ingredient[];
  selectedIngredientIds: string[];
  hasError: boolean;
  onSelectedIngredientIdsChange: (ingredientIds: string[]) => void;
}

export const ProductIngredientsEditor: FC<ProductIngredientsEditorProps> = ({
  ingredients,
  selectedIngredientIds,
  hasError,
  onSelectedIngredientIdsChange,
}) => {
  const [ingredientSearchValue, setIngredientSearchValue] = useState("");

  const selectedIngredients = useMemo(
    () =>
      ingredients.filter((ingredient) => selectedIngredientIds.includes(ingredient._id)),
    [ingredients, selectedIngredientIds],
  );

  const availableIngredients = useMemo(
    () =>
      ingredients.filter((ingredient) => !selectedIngredientIds.includes(ingredient._id)),
    [ingredients, selectedIngredientIds],
  );

  const handleAddIngredient = (ingredientId: string) => {
    if (selectedIngredientIds.includes(ingredientId)) {
      return;
    }

    onSelectedIngredientIdsChange([...selectedIngredientIds, ingredientId]);
    setIngredientSearchValue("");
  };

  const handleRemoveIngredient = (ingredientId: string) => {
    onSelectedIngredientIdsChange(
      selectedIngredientIds.filter((currentId) => currentId !== ingredientId),
    );
  };

  return (
    <>
      <Box>
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          Current ingredients
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {selectedIngredients.map((ingredient) => (
            <Button
              key={ingredient._id}
              variant="contained"
              onClick={() => handleRemoveIngredient(ingredient._id)}
            >
              {ingredient.name}
            </Button>
          ))}
          {selectedIngredients.length === 0 && (
            <Typography color="error">Select at least one ingredient</Typography>
          )}
        </Stack>
      </Box>

      <Box>
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          All ingredients
        </Typography>
        <Autocomplete
          options={availableIngredients}
          value={null}
          inputValue={ingredientSearchValue}
          getOptionLabel={(ingredient) => ingredient.name}
          noOptionsText="All ingredients are selected"
          onInputChange={(_, value) => setIngredientSearchValue(value)}
          onChange={(_, ingredient) => {
            if (ingredient) {
              handleAddIngredient(ingredient._id);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Add ingredient"
              error={hasError}
              helperText={hasError ? "Select at least one ingredient" : undefined}
            />
          )}
        />
      </Box>
    </>
  );
};
