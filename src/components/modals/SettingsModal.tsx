import { useTheme } from "@emotion/react";
import {
  Box,
  Select,
  Stack,
  Text,
  TextInput,
  Group,
  Paper,
  Button,
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
import { playSound, soundOptions, SoundType } from "../../utils";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const updateIntervalOptions = [
  { value: "600", label: "Very Fast (0.6s) - Optimized for speed" },
  { value: "800", label: "Fast (0.8s) - Recommended for best performance" },
  { value: "1000", label: "Normal (1s) - Balanced speed and reliability" },
  { value: "1200", label: "Conservative (1.2s) - Enhanced reliability" },
  { value: "1500", label: "Safe (1.5s) - Maximum stability" },
  { value: "2000", label: "Very Safe (2s) - Minimal server load" },
];

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

  const handleSoundTypeChange = (value: string | null) => {
    if (value) {
      config.setSoundType(value);
    }
  };

  const handleTestSound = () => {
    playSound(config.soundType as SoundType);
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

        <FormSection title="Sound & Notification Settings">
          <Group
            align="apart"
            style={{
              paddingTop: "10px",
            }}
          >
            <CustomIconCheckbox
              label="Enable Sound"
              name="soundEnabled"
              checked={config.soundEnabled}
              onChange={() => config.setSoundEnabled(!config.soundEnabled)}
            />
          </Group>
          
          <Group
            align="apart"
            style={{
              paddingTop: "10px",
            }}
          >
            <CustomIconCheckbox
              label="Enable Popup Notifications"
              name="notificationEnabled"
              checked={config.notificationEnabled}
              onChange={() => config.setNotificationEnabled(!config.notificationEnabled)}
            />
          </Group>
          
          {config.soundEnabled && (
            <>
              <Select
                label="Sound Type"
                data={soundOptions.map(s => ({ value: s.value, label: s.label }))}
                placeholder="Select sound"
                onChange={handleSoundTypeChange}
                value={config.soundType}
                styles={themedInputStyles(theme)}
                mt="sm"
              />
              
              <Button
                variant="light"
                size="sm"
                mt="md"
                onClick={handleTestSound}
                style={{ width: "100%" }}
              >
                Test Sound
              </Button>
            </>
          )}
          
          <Text size="sm" color="dimmed" mt="sm">
            Notifications now trigger only when hits are accepted to your queue, 
            not when initially detected. Sounds play instantly with no delays.
          </Text>
        </FormSection>

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
