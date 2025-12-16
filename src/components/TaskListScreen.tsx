import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { taskService } from '../services/TaskService';
import { Task } from '../database/types';

export const TaskListScreen: React.FC = () => {
  const { t } = useTranslation();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newTaskDescription, setNewTaskDescription] = useState<string>('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editDescription, setEditDescription] = useState<string>('');
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const allTasks = await taskService.getAllTasks();
      setTasks(allTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      Alert.alert(t('common.error'), t('errors.storageError'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskDescription.trim()) {
      Alert.alert(t('common.error'), t('tasks.emptyDescription'));
      return;
    }

    try {
      await taskService.createTask(newTaskDescription);
      setNewTaskDescription('');
      await loadTasks();
    } catch (error) {
      console.error('Error adding task:', error);
      Alert.alert(t('common.error'), t('errors.storageError'));
    }
  };

  const handleToggleTask = async (task: Task) => {
    try {
      await taskService.toggleTaskCompletion(task.id);
      await loadTasks();
    } catch (error) {
      console.error('Error toggling task:', error);
      Alert.alert(t('common.error'), t('errors.storageError'));
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditDescription(task.description);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingTask) return;

    if (!editDescription.trim()) {
      Alert.alert(t('common.error'), t('tasks.emptyDescription'));
      return;
    }

    try {
      await taskService.updateTask(editingTask.id, { description: editDescription });
      setShowEditModal(false);
      setEditingTask(null);
      setEditDescription('');
      await loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert(t('common.error'), t('errors.storageError'));
    }
  };

  const handleDeleteTask = (task: Task) => {
    Alert.alert(
      t('tasks.deleteTask'),
      t('tasks.confirmDelete'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await taskService.deleteTask(task.id);
              await loadTasks();
            } catch (error) {
              console.error('Error deleting task:', error);
              Alert.alert(t('common.error'), t('errors.storageError'));
            }
          },
        },
      ]
    );
  };

  const renderTask = ({ item }: { item: Task }) => {
    return (
      <View style={styles.taskCard}>
        <TouchableOpacity
          style={styles.taskCheckbox}
          onPress={() => handleToggleTask(item)}
        >
          <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
            {item.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

        <View style={styles.taskContent}>
          <Text style={[styles.taskDescription, item.completed && styles.taskDescriptionCompleted]}>
            {item.description}
          </Text>
          <Text style={styles.taskDate}>
            {item.createdAt.toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.taskActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditTask(item)}
          >
            <Text style={styles.actionButtonText}>{t('common.edit')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteTask(item)}
          >
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
              {t('common.delete')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEditModal = () => {
    return (
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('tasks.editTask')}</Text>
            
            <TextInput
              style={styles.modalInput}
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder={t('tasks.taskPlaceholder')}
              multiline
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowEditModal(false);
                  setEditingTask(null);
                  setEditDescription('');
                }}
              >
                <Text style={styles.modalButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={handleSaveEdit}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextSave]}>
                  {t('common.save')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('tasks.title')}</Text>

        {/* Add Task Input */}
        <View style={styles.addTaskSection}>
          <TextInput
            style={styles.input}
            value={newTaskDescription}
            onChangeText={setNewTaskDescription}
            placeholder={t('tasks.taskPlaceholder')}
            onSubmitEditing={handleAddTask}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddTask}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        )}

        {/* Task List */}
        {!loading && (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={renderTask}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{t('tasks.noTasks')}</Text>
              </View>
            }
          />
        )}
      </View>
      {renderEditModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  addTaskSection: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  taskCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskCheckbox: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskContent: {
    flex: 1,
  },
  taskDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  taskDescriptionCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  taskDate: {
    fontSize: 12,
    color: '#999',
  },
  taskActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#F0F0F0',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
  },
  deleteButtonText: {
    color: '#F44336',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 12,
    fontSize: 16,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#F0F0F0',
  },
  modalButtonSave: {
    backgroundColor: '#007AFF',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  modalButtonTextSave: {
    color: '#FFF',
  },
});
