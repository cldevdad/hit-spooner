import { useTheme } from "@emotion/react";
import {
  Box,
  Select,
  Stack,
  Text,
  TextInput,
  Group,
  Paper,
} from "@mantine/core";
import React from "react";
import { useStore } from "../../hooks";
import {
  StyledModal,
  StyledTitle,
  ThemeKey,
  themeOptions,
  themedInputStyles,
} from "../../styles";
import { IconCheck, IconCircle } from "@tabler/icons-react";
import {
  hitFilterPageSizeOptions,
  hitFilterSortOptions,
} from "@hit-spooner/api";

/**
 * Interface for the SettingsModal component props.
 */
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const updateIntervalOptions = [
  { value: "900", label: "Lightning Fast (900ms)" },
  { value: "1200", label: "Fast (1200ms)" },
  { value: "1500", label: "Balanced (1500ms)" },
  { value: "2000", label: "Slow (2000ms)" },
];

/**
 * Modal component that provides a UI for configuring HitSpooner.
 *
 * @param {SettingsModalProps} props - Component properties.
 * @param {boolean} props.isOpen - Determines if the modal is open.
 * @param {() => void} props.onClose - Callback function to close the modal.
 */
const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const theme = useTheme();
  const { filters, setFilters, config } = useStore();

  const handleThemeChange = (key: ThemeKey | null) => {
    if (key) {
      config.setTheme(key);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFilters({
        ...filters,
        [name]: checked,
      });
    } else {
      setFilters({
        ...filters,
        [name]: value,
      });
    }
  };

  const handleIntervalChange = (value: string | null) => {
    if (value) {
      config.setUpdateInterval(parseInt(value));
    }
  };

  return (
    <StyledModal
      opened={isOpen}
      onClose={onClose}
      title="Settings"
      size="md"
      transitionProps={{
        transition: "fade",
        duration: 300,
        timingFunction: "ease",
      }}
      closeOnClickOutside
    >
      <Stack gap="md">
        {/* Theme Selection */}
        <FormSection title="General Settings">
          <Select
            label="Theme"
            data={themeOptions}
            placeholder="Select theme"
            onChange={(value) => handleThemeChange(value as ThemeKey)}
            value={config.theme}
            styles={themedInputStyles(theme)}
          />
        </FormSection>

        {/* Update Interval Selection */}
        <FormSection title="Update Interval">
          <Select
            label="Update Interval"
            data={updateIntervalOptions}
            placeholder="Select update interval"
            onChange={handleIntervalChange}
            value={config.updateInterval.toString()}
            styles={themedInputStyles(theme)}
          />
        </FormSection>

        {/* Search Filters */}
        <FormSection title="Search Settings">
          <TextInput
            label="Minimum Reward"
            type="number"
            name="minReward"
            step="0.01"
            min="0"
            value={filters.minReward}
            onChange={handleFilterChange}
            styles={themedInputStyles(theme)}
          />
          <Select
            label="Sort"
            name="sort"
            value={filters.sort}
            onChange={(value) =>
              handleFilterChange({ target: { name: "sort", value } } as any)
            }
            data={hitFilterSortOptions}
            styles={themedInputStyles(theme)}
          />
          <Select
            label="Page Size"
            name="pageSize"
            value={filters.pageSize}
            onChange={(value) =>
              handleFilterChange({ target: { name: "pageSize", value } } as any)
            }
            data={hitFilterPageSizeOptions}
            styles={themedInputStyles(theme)}
          />
          <Group
            align="apart"
            style={{
              paddingTop: "10px",
            }}
          >
            <CustomIconCheckbox
              label="Qualified Only"
              name="qualified"
              checked={filters.qualified}
              onChange={handleFilterChange}
            />
            <CustomIconCheckbox
              label="Masters Required"
              name="masters"
              checked={filters.masters}
              onChange={handleFilterChange}
            />
          </Group>
        </FormSection>
      </Stack>
    </StyledModal>
  );
};

/**
 * FormSection component to group related form controls together with a title.
 */
const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <Paper withBorder shadow="md" p="md" radius="md">
      <StyledTitle order={5} style={{ marginBottom: "10px" }}>
        {title}
      </StyledTitle>
      {children}
    </Paper>
  );
};

interface CustomIconCheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const CustomIconCheckbox: React.FC<CustomIconCheckboxProps> = ({
  label,
  name,
  checked,
  onChange,
}) => {
  const theme = useTheme();

  return (
    <Group>
      <Box
        component="label"
        htmlFor={name}
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          style={{ display: "none" }}
        />
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "20px",
            height: "20px",
            borderRadius: "4px",
            backgroundColor: checked
              ? theme.colors.primary[6]
              : theme.colors.primary[2],
            color: theme.white,
          }}
        >
          {checked ? <IconCheck size={14} /> : <IconCircle size={14} />}
        </Box>
        <Text
          style={{
            marginLeft: theme.spacing.xs,
          }}
        >
          {label}
        </Text>
      </Box>
    </Group>
  );
};

export default SettingsModal;
