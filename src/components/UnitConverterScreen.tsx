import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  unitConverter,
  UnitCategory,
  Unit,
  getAllCategories,
} from '../modules/unit-converter';

type PickerType = 'category' | 'fromUnit' | 'toUnit' | null;

export const UnitConverterScreen: React.FC = () => {
  const { t } = useTranslation();
  
  const [selectedCategory, setSelectedCategory] = useState<UnitCategory>('length');
  const [availableUnits, setAvailableUnits] = useState<Unit[]>([]);
  const [fromUnit, setFromUnit] = useState<Unit | null>(null);
  const [toUnit, setToUnit] = useState<Unit | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPicker, setShowPicker] = useState<PickerType>(null);

  // Update available units when category changes
  useEffect(() => {
    const units = unitConverter.getSupportedUnits(selectedCategory);
    setAvailableUnits(units);
    
    // Set default units
    if (units.length >= 2) {
      setFromUnit(units[0]);
      setToUnit(units[1]);
    } else if (units.length === 1) {
      setFromUnit(units[0]);
      setToUnit(units[0]);
    }
    
    // Clear previous results
    setResult('');
    setError('');
  }, [selectedCategory]);

  // Perform conversion when inputs change
  useEffect(() => {
    if (!fromUnit || !toUnit || !inputValue) {
      setResult('');
      setError('');
      return;
    }

    const numValue = parseFloat(inputValue);
    
    try {
      const converted = unitConverter.convert(numValue, fromUnit, toUnit);
      // Format to 6 significant figures
      const formatted = Number(converted.toPrecision(6));
      setResult(formatted.toString());
      setError('');
    } catch (err) {
      setError(t('errors.invalidInput'));
      setResult('');
    }
  }, [inputValue, fromUnit, toUnit, t]);

  const handleInputChange = (text: string) => {
    setInputValue(text);
  };

  const handleCategorySelect = (category: UnitCategory) => {
    setSelectedCategory(category);
    setShowPicker(null);
  };

  const handleFromUnitSelect = (unit: Unit) => {
    setFromUnit(unit);
    setShowPicker(null);
  };

  const handleToUnitSelect = (unit: Unit) => {
    setToUnit(unit);
    setShowPicker(null);
  };

  const categories = getAllCategories();

  const renderPickerModal = () => {
    if (!showPicker) return null;

    let data: any[] = [];
    let onSelect: (item: any) => void = () => {};
    let getLabel: (item: any) => string = () => '';

    if (showPicker === 'category') {
      data = categories;
      onSelect = handleCategorySelect;
      getLabel = (cat) => t(`unitConverter.categories.${cat}`);
    } else if (showPicker === 'fromUnit' || showPicker === 'toUnit') {
      data = availableUnits;
      onSelect = showPicker === 'fromUnit' ? handleFromUnitSelect : handleToUnitSelect;
      getLabel = (unit) => `${unit.name} (${unit.symbol})`;
    }

    return (
      <Modal
        visible={true}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPicker(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowPicker(null)}>
                <Text style={styles.modalCloseButton}>{t('common.close')}</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={data}
              keyExtractor={(item: any, index: number) =>
                typeof item === 'string' ? item : item.id || index.toString()
              }
              renderItem={({ item }: { item: any }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => onSelect(item)}
                >
                  <Text style={styles.modalItemText}>{getLabel(item)}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>{t('unitConverter.title')}</Text>

          {/* Category Selector */}
          <View style={styles.section}>
            <Text style={styles.label}>{t('unitConverter.category')}</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowPicker('category')}
            >
              <Text style={styles.selectorText}>
                {t(`unitConverter.categories.${selectedCategory}`)}
              </Text>
              <Text style={styles.selectorArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Input Value */}
          <View style={styles.section}>
            <Text style={styles.label}>{t('unitConverter.value')}</Text>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={handleInputChange}
              keyboardType="numeric"
              placeholder={t('unitConverter.enterValue')}
              placeholderTextColor="#999"
            />
          </View>

          {/* From Unit Selector */}
          <View style={styles.section}>
            <Text style={styles.label}>{t('unitConverter.from')}</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowPicker('fromUnit')}
            >
              <Text style={styles.selectorText}>
                {fromUnit ? `${fromUnit.name} (${fromUnit.symbol})` : t('unitConverter.selectUnit')}
              </Text>
              <Text style={styles.selectorArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* To Unit Selector */}
          <View style={styles.section}>
            <Text style={styles.label}>{t('unitConverter.to')}</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowPicker('toUnit')}
            >
              <Text style={styles.selectorText}>
                {toUnit ? `${toUnit.name} (${toUnit.symbol})` : t('unitConverter.selectUnit')}
              </Text>
              <Text style={styles.selectorArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Result Display */}
          {result && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>{t('unitConverter.result')}</Text>
              <Text style={styles.resultValue}>
                {result} {toUnit?.symbol}
              </Text>
            </View>
          )}

          {/* Error Display */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      </ScrollView>
      {renderPickerModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  selector: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  selectorArrow: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  resultContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  resultLabel: {
    fontSize: 14,
    color: '#2E7D32',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  errorText: {
    fontSize: 14,
    color: '#C62828',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    alignItems: 'flex-end',
  },
  modalCloseButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
});
