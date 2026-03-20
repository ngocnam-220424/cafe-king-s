/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

<<<<<<< HEAD
import React, { useState, useEffect, useMemo, Component, ReactNode, ErrorInfo } from 'react';
=======
import React, { useState, useEffect, useMemo } from 'react';
>>>>>>> 045dd41a1f65ebaaeeaaed3435600b34bacdb0ec
import { 
  Coffee, 
  Users, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  Receipt, 
  History as HistoryIcon, 
  LayoutGrid,
  ChevronRight,
  Search,
  ShoppingCart,
  Settings,
  Edit2,
  Save,
  PlusCircle,
  Upload,
  ImageOff,
  ImageIcon,
  Loader2,
  CheckSquare,
  Square,
  AlertTriangle,
  Copy,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Virtuoso, VirtuosoGrid } from 'react-virtuoso';
import { QRCodeSVG } from 'qrcode.react';
import { apiFetch, ApiError } from './utils/api';
// import imageCompression from 'browser-image-compression';
import { Table, TableStatus, MenuItem, OrderItem, PaymentRecord, ItemSize } from './types';
import { MENU_ITEMS, SIZE_MULTIPLIERS } from './constants';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  getDocFromServer
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { db, auth } from './firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
import { LazyImage } from './components/LazyImage';

const INITIAL_TABLES: Table[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  status: 'Empty',
  currentOrder: []
}));

const MENU_CATEGORIES = [
  'All',
  'Coffee',
  'Trà',
  'Sữa chua',
  'Trà sữa',
  'Soda',
  'Nước ép',
  'Kem – chè',
  'Thuốc lá',
  'Hạt dưa – hạt hướng dương'
];

<<<<<<< HEAD
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<any, any> {
  props: any;
  state: any = { hasError: false, error: null };

  constructor(props: any) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Đã xảy ra lỗi</h1>
            <p className="text-gray-600 mb-6">
              Ứng dụng đã gặp sự cố không mong muốn. Vui lòng tải lại trang hoặc liên hệ hỗ trợ.
            </p>
            {this.state.error && (
              <div className="bg-red-50 rounded-lg p-4 mb-6 text-left overflow-auto max-h-40">
                <code className="text-xs text-red-700">{this.state.error.message}</code>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
=======
export default function App() {
>>>>>>> 045dd41a1f65ebaaeeaaed3435600b34bacdb0ec
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [history, setHistory] = useState<PaymentRecord[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'tables' | 'history' | 'menu' | 'payment' | 'qr'>('tables');
  const [viewMode, setViewMode] = useState<'pos' | 'customer'>('pos');
  const [customerTableId, setCustomerTableId] = useState<number | null>(null);
  const [customerOrder, setCustomerOrder] = useState<OrderItem[]>([]);
  const [isOrderSent, setIsOrderSent] = useState(false);
  const [menuActiveCategory, setMenuActiveCategory] = useState<string>('All');
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [selectedPaymentTableId, setSelectedPaymentTableId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderModalTab, setOrderModalTab] = useState<'menu' | 'order'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    type: 'single' | 'bulk' | 'all' | 'permanent';
    id?: string;
    name?: string;
    count?: number;
  }>({ show: false, type: 'single' });
  const [confirmInput, setConfirmInput] = useState('');

  // Upload State
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [isFullImageOpen, setIsFullImageOpen] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Menu Selection & Toast State
  const [selectedMenuIds, setSelectedMenuIds] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  // Menu Management State
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [originalImagePath, setOriginalImagePath] = useState<string | undefined>(undefined);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    basePrice: 30000,
    category: 'Coffee',
    imageUrl: '',
    description: ''
  });

  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Set custom parameters to force account selection
      provider.setCustomParameters({ prompt: 'select_account' });
      
      await signInWithPopup(auth, provider);
      showToast('Đăng nhập thành công!', 'success');
    } catch (error: any) {
      console.error('Login error:', error);
      
      let message = 'Đăng nhập thất bại';
      if (error.code === 'auth/popup-blocked') {
        message = 'Trình duyệt đã chặn cửa sổ đăng nhập. Vui lòng cho phép hiện popup hoặc mở ứng dụng trong tab mới.';
      } else if (error.code === 'auth/unauthorized-domain') {
        const domain = window.location.hostname;
        message = `Tên miền "${domain}" chưa được cấp quyền trong Firebase Console. Vui lòng thêm nó vào mục "Authorized Domains" trong phần Authentication Settings.`;
      } else if (error.code === 'auth/popup-closed-by-user') {
        message = 'Cửa sổ đăng nhập đã bị đóng.';
      } else if (error.message) {
        message = `Lỗi: ${error.message}`;
      }
      
      showToast(message, 'error');
    }
  };

  const testConnection = async () => {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration. ");
      }
    }
  };

  useEffect(() => {
    testConnection();
    setIsLoading(false);
  }, []);

  // Real-time listeners
  const loadMenu = async () => {
    try {
      const data = await apiFetch<MenuItem[]>(`/api/menu?t=${Date.now()}`, {
        cache: 'no-store'
      });
      
      if (data.length === 0 && isAdminUser()) {
        // Initialize menu if empty
        for (const item of MENU_ITEMS) {
          await apiFetch('/api/menu/update', {
            method: 'POST',
            body: item
          });
        }
        const retryData = await apiFetch<MenuItem[]>('/api/menu');
        setMenuItems(retryData);
      } else {
        setMenuItems(data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading menu:', error);
      if (error instanceof ApiError) {
        showToast(`Lỗi khi tải menu: ${error.message}`, 'error');
      } else {
        showToast('Lỗi khi tải danh sách món', 'error');
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthReady) return;

    const unsubTables = onSnapshot(collection(db, 'tables'), (snapshot) => {
      const tablesData = snapshot.docs.map(doc => doc.data() as Table).sort((a, b) => a.id - b.id);
      if (tablesData.length > 0) {
        setTables(tablesData);
      } else if (isAdminUser()) {
        // Initialize tables if empty
        INITIAL_TABLES.forEach(async (table) => {
          await setDoc(doc(db, 'tables', table.id.toString()), table);
        });
      }
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'tables'));

    // Load menu from server instead of Firestore onSnapshot
    loadMenu();

    const historyQuery = query(collection(db, 'history'), orderBy('timestamp', 'desc'), limit(100));
    const unsubHistory = onSnapshot(historyQuery, (snapshot) => {
      const historyData = snapshot.docs.map(doc => doc.data() as PaymentRecord);
      setHistory(historyData);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'history'));

    return () => {
      unsubTables();
      unsubHistory();
    };
  }, [isAuthReady, user]);

  const isAdminUser = () => {
    return user?.email === 'ngocnamglai@gmail.com';
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');
    const isCustomerPath = window.location.pathname.startsWith('/customer');
    
    if (table || isCustomerPath) {
      setViewMode('customer');
      if (table) setCustomerTableId(parseInt(table));
    }
  }, []);

  useEffect(() => {
    // No polling needed with onSnapshot
  }, [viewMode, isLoading]);


  useEffect(() => {
    if (selectedTableId !== null) {
      setOrderModalTab('menu');
    }
  }, [selectedTableId]);

  const activeTable = useMemo(() => 
    tables.find(t => t.id === selectedTableId), 
    [tables, selectedTableId]
  );

  const activePaymentTable = useMemo(() => 
    tables.find(t => t.id === selectedPaymentTableId), 
    [tables, selectedPaymentTableId]
  );

  const categories = useMemo(() => 
    ['All', ...Array.from(new Set(menuItems.map(item => item.category)))],
    [menuItems]
  );

  const filteredMenu = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const updateTableStatus = async (tableId: number, status: TableStatus) => {
    try {
      await updateDoc(doc(db, 'tables', tableId.toString()), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tables/${tableId}`);
    }
  };

  const addToOrder = async (tableId: number, item: MenuItem) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    const price = item.basePrice;
    const existing = table.currentOrder.find(oi => oi.itemId === item.id);
    let newOrder;
    if (existing) {
      newOrder = table.currentOrder.map(oi => 
        oi.itemId === item.id 
          ? { ...oi, quantity: oi.quantity + 1 } 
          : oi
      );
    } else {
      newOrder = [...table.currentOrder, { itemId: item.id, name: item.name, size: 'M', quantity: 1, price, note: '' }];
    }

    try {
      await updateDoc(doc(db, 'tables', tableId.toString()), { currentOrder: newOrder });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tables/${tableId}`);
    }
  };

  const updateQuantity = async (tableId: number, itemId: string, delta: number) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    const newOrder = table.currentOrder.map(oi => 
      oi.itemId === itemId 
        ? { ...oi, quantity: Math.max(0, oi.quantity + delta) } 
        : oi
    ).filter(oi => oi.quantity > 0);

    try {
      await updateDoc(doc(db, 'tables', tableId.toString()), { currentOrder: newOrder });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tables/${tableId}`);
    }
  };

  const clearOrder = async (tableId: number) => {
    try {
      await updateDoc(doc(db, 'tables', tableId.toString()), { currentOrder: [], status: 'Empty' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tables/${tableId}`);
    }
  };

  const handleConfirmOrder = async (tableId: number) => {
    await updateTableStatus(tableId, 'Serving');
    setSelectedTableId(null);
    setToast({ message: 'Đã xác nhận đơn hàng', type: 'success' });
  };

  const handleSendCustomerOrder = async () => {
    if (!customerTableId || customerOrder.length === 0) return;

    const table = tables.find(t => t.id === customerTableId);
    if (!table) return;

    const newOrder = [...table.currentOrder, ...customerOrder];

    try {
      await updateDoc(doc(db, 'tables', customerTableId.toString()), { 
        status: 'Serving',
        currentOrder: newOrder 
      });
      setIsOrderSent(true);
      setCustomerOrder([]);
      setToast({ message: 'Đã gửi yêu cầu gọi món thành công!', type: 'success' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tables/${customerTableId}`);
    }
  };

  const handleRequestPayment = (tableId: number) => {
    updateTableStatus(tableId, 'Unpaid');
    setSelectedTableId(null);
  };

  const handleCheckout = async (tableId: number) => {
    const table = tables.find(t => t.id === tableId);
    if (!table || table.currentOrder.length === 0) return;

    const total = table.currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const record: PaymentRecord = {
      id: Math.random().toString(36).substr(2, 9),
      tableId,
      items: [...table.currentOrder],
      total,
      timestamp: Date.now()
    };

    try {
      await setDoc(doc(db, 'history', record.id), record);
      await updateTableStatus(tableId, 'Paid');
      setSelectedPaymentTableId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `history/${record.id}`);
    }
  };

  const resetTable = (tableId: number) => {
    clearOrder(tableId);
  };

  const deleteHistoryRecord = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'history', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `history/${id}`);
    }
  };

  // Menu Management Actions
  const handleUpdateItem = async (item: MenuItem) => {
    setIsSaving(true);
    try {
      const updatedItem = await apiFetch<MenuItem>('/api/menu/update', {
        method: 'POST',
        body: item
      });

      // Update local state immediately
      setMenuItems(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
      
      showToast('Cập nhật món thành công', 'success');
      setEditingItem(null);
      setPreviewUrl(null);
      // loadMenu(); // Still good to sync, but state is already updated
    } catch (error) {
      console.error('Error updating item:', error);
      if (error instanceof ApiError) {
        showToast(`Lỗi khi cập nhật món: ${error.message}`, 'error');
      } else {
        showToast('Lỗi khi cập nhật món', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleSelectMenu = (id: string) => {
    setSelectedMenuIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const filteredItems = menuActiveCategory === 'All' 
      ? menuItems 
      : menuItems.filter(m => m.category === menuActiveCategory);
      
    if (selectedMenuIds.length === filteredItems.length && filteredItems.length > 0) {
      setSelectedMenuIds([]);
    } else {
      setSelectedMenuIds(filteredItems.map(m => m.id));
    }
  };

  const confirmDelete = async () => {
    const { type, id, name } = deleteConfirm;
    
    if (type === 'permanent') {
      if (confirmInput.trim() !== name?.trim()) {
        showToast('Tên món không khớp. Vui lòng nhập lại.', 'error');
        return;
      }
    }

    try {
      if ((type === 'single' || type === 'permanent') && id) {
        await apiFetch('/api/menu/delete', {
          method: 'POST',
          body: { id }
        });
        
        setSelectedMenuIds(prev => prev.filter(i => i !== id));
        showToast(type === 'permanent' ? 'Đã xóa vĩnh viễn món thành công' : 'Đã xóa món thành công');
      } else if (type === 'bulk') {
        for (const itemId of selectedMenuIds) {
          await apiFetch('/api/menu/delete', {
            method: 'POST',
            body: { id: itemId }
          });
        }
        setSelectedMenuIds([]);
        showToast(`Đã xóa ${selectedMenuIds.length} món thành công`);
      } else if (type === 'all') {
        for (const item of menuItems) {
          await apiFetch('/api/menu/delete', {
            method: 'POST',
            body: { id: item.id }
          });
        }
        setSelectedMenuIds([]);
        showToast('Đã xóa toàn bộ menu thành công', 'warning');
      }
      loadMenu(); // Reload menu list from server
    } catch (error) {
      console.error('Error deleting item:', error);
      if (error instanceof ApiError) {
        showToast(`Lỗi khi xóa món: ${error.message}`, 'error');
      } else {
        showToast('Lỗi khi xóa món', 'error');
      }
    }
    
    setDeleteConfirm({ ...deleteConfirm, show: false });
    setConfirmInput('');
  };

  const handleDeleteItem = (id: string) => {
    const item = menuItems.find(mi => mi.id === id);
    setDeleteConfirm({
      show: true,
      type: 'single',
      id,
      name: item?.name
    });
  };

  const handlePermanentDelete = (id: string) => {
    const item = menuItems.find(mi => mi.id === id);
    setConfirmInput('');
    setDeleteConfirm({
      show: true,
      type: 'permanent',
      id,
      name: item?.name
    });
  };

  const handleDeleteSelected = () => {
    if (selectedMenuIds.length === 0) return;
    setDeleteConfirm({
      show: true,
      type: 'bulk',
      count: selectedMenuIds.length
    });
  };

  const handleClearAllMenu = () => {
    setDeleteConfirm({
      show: true,
      type: 'all'
    });
  };

  const handleAddMissingItems = async () => {
    const currentNames = new Set(menuItems.map(item => item.name.toLowerCase().trim()));
    const missingItems = MENU_ITEMS.filter(item => !currentNames.has(item.name.toLowerCase().trim()));
    
    if (missingItems.length === 0) {
      showToast('Tất cả món mặc định đã có trong menu!', 'success');
      return;
    }

    if (window.confirm(`Tìm thấy ${missingItems.length} món mới. Bạn có muốn thêm vào menu hiện tại không?`)) {
      try {
        for (const item of missingItems) {
          await apiFetch('/api/menu/update', {
            method: 'POST',
            body: item
          });
        }
        showToast(`Đã thêm ${missingItems.length} món mới thành công!`, 'success');
        loadMenu(); // Reload menu list from server
      } catch (error) {
        console.error('Error adding missing items:', error);
        if (error instanceof ApiError) {
          showToast(`Lỗi khi thêm món mới: ${error.message}`, 'error');
        } else {
          showToast('Lỗi khi thêm món mới', 'error');
        }
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isNew: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast('Chỉ chấp nhận file JPG, PNG hoặc WEBP', 'error');
      return;
    }

    // Preview image immediately
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const data = await apiFetch<{ url: string }>('/api/upload-image', {
        method: 'POST',
        body: formData
      });

      const imageUrl = data.url;

      if (isNew) {
        setNewItem(prev => ({ ...prev, imageUrl }));
      } else {
        setEditingItem(prev => {
          if (!prev) return null;
          const updated = { ...prev, imageUrl };
          // Update menuItems state immediately
          setMenuItems(items => items.map(i => i.id === updated.id ? updated : i));
          return updated;
        });
      }
      showToast('Tải ảnh lên thành công', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      if (error instanceof ApiError) {
        showToast(`Lỗi khi tải ảnh lên: ${error.message}`, 'error');
      } else {
        showToast('Lỗi khi tải ảnh lên', 'error');
      }
      setPreviewUrl(null); // Clear preview on error
    } finally {
      setIsSaving(false);
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files) as File[];
    setUploadProgress({ current: 0, total: fileList.length });

    const CONCURRENCY_LIMIT = 3;
    let completedCount = 0;
    const results: MenuItem[] = [];

    const uploadFile = async (file: File) => {
      try {
        const formData = new FormData();
        formData.append('image', file);

        const uploadData = await apiFetch<{ success: boolean; url: string }>('/api/upload-image', {
          method: 'POST',
          body: formData
        });
        
        if (!uploadData.url) throw new Error('No URL returned from upload');
        
        const imageUrl = uploadData.url;

        // Create a new menu item for each image (using file name as item name)
        const itemName = file.name.split('.')[0].replace(/[-_]/g, ' ');
        const newItem: MenuItem = {
          id: Math.random().toString(36).substr(2, 9),
          name: itemName,
          basePrice: 30000,
          category: 'Coffee',
          imageUrl,
          description: ''
        };

        const updatedItem = await apiFetch<MenuItem>('/api/menu/update', {
          method: 'POST',
          body: newItem
        });
        
        results.push(updatedItem);
        
        // Update local state immediately for better UX
        setMenuItems(prev => {
          const exists = prev.find(i => i.id === updatedItem.id);
          if (exists) {
            return prev.map(i => i.id === updatedItem.id ? updatedItem : i);
          }
          return [...prev, updatedItem];
        });

      } catch (error: any) {
        console.error(`Error processing file ${file.name}:`, error);
        showToast(`Lỗi khi xử lý file ${file.name}: ${error.message || 'Unknown error'}`, 'error');
      } finally {
        completedCount++;
        setUploadProgress({ current: completedCount, total: fileList.length });
      }
    };

    // Queue mechanism
    const queue = [...fileList];
    const workers = Array(Math.min(CONCURRENCY_LIMIT, queue.length))
      .fill(null)
      .map(async () => {
        while (queue.length > 0) {
          const file = queue.shift();
          if (file) await uploadFile(file);
        }
      });

    await Promise.all(workers);

    showToast(`Đã tải lên ${completedCount}/${fileList.length} ảnh thành công`, 'success');
    loadMenu(); // Final sync
    setTimeout(() => setUploadProgress(null), 2000);
  };

  const removeImage = (isNew: boolean) => {
    setPreviewUrl(null);
    if (isNew) {
      setNewItem(prev => ({ ...prev, imageUrl: '', imagePath: undefined }));
    } else {
      setEditingItem(prev => prev ? { ...prev, imageUrl: '', imagePath: undefined } : null);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.category) return;
    setIsSaving(true);
    try {
      const item: MenuItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: newItem.name,
        basePrice: newItem.basePrice || 30000,
        category: newItem.category,
        imageUrl: newItem.imageUrl || '',
        description: newItem.description || ''
      };

      const addedItem = await apiFetch<MenuItem>('/api/menu/update', {
        method: 'POST',
        body: item
      });

      // Update local state
      setMenuItems(prev => [...prev, addedItem]);

      showToast('Thêm món thành công', 'success');
      setIsAddingItem(false);
      setNewItem({
        name: '',
        basePrice: 30000,
        category: 'Coffee',
        imageUrl: '',
        description: ''
      });
      setPreviewUrl(null);
      // loadMenu();
    } catch (error) {
      console.error('Error adding item:', error);
      if (error instanceof ApiError) {
        showToast(`Lỗi khi thêm món: ${error.message}`, 'error');
      } else {
        showToast('Lỗi khi thêm món', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case 'Empty': return 'bg-emerald-500';
      case 'Serving': return 'bg-amber-500';
      case 'Unpaid': return 'bg-rose-500';
      case 'Paid': return 'bg-slate-400';
      default: return 'bg-slate-200';
    }
  };

  const getStatusText = (status: TableStatus) => {
    switch (status) {
      case 'Empty': return 'Trống';
      case 'Serving': return 'Phục vụ';
      case 'Unpaid': return 'Chờ thanh toán';
      case 'Paid': return 'Đã thanh toán';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (viewMode === 'customer') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-20">
          <div className="flex justify-between items-center max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                <Coffee className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-slate-800">Coffee King's</h1>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Bàn số {customerTableId}</p>
              </div>
            </div>
            {customerOrder.length > 0 && (
              <div className="relative p-2 text-slate-600 bg-slate-100 rounded-xl">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {customerOrder.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 max-w-2xl mx-auto w-full p-4 pb-32">
          {isOrderSent ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center py-20"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Đã gửi yêu cầu gọi món</h2>
              <p className="text-slate-500 mb-8">Nhân viên sẽ phục vụ bạn trong giây lát. Cảm ơn quý khách!</p>
              <button 
                onClick={() => setIsOrderSent(false)}
                className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100"
              >
                Tiếp tục gọi món
              </button>
            </motion.div>
          ) : (
            <>
              {/* Category Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar py-2 sticky top-[73px] bg-slate-50 z-10">
                {MENU_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setMenuActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                      menuActiveCategory === cat 
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100' 
                      : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-1 gap-4">
                {menuItems
                  .filter(item => menuActiveCategory === 'All' || item.category === menuActiveCategory)
                  .map(item => {
                    const inOrder = customerOrder.find(oi => oi.itemId === item.id);
                    return (
                      <div key={item.id} className="bg-white p-4 rounded-3xl border border-slate-200 flex gap-4 shadow-sm">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                          <LazyImage 
                            src={item.imageUrl}
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <h3 className="font-bold text-slate-800">{item.name}</h3>
                            <p className="text-emerald-600 font-bold mt-1">{formatCurrency(item.basePrice)}</p>
                            {inOrder && (
                              <input 
                                type="text"
                                placeholder="Ghi chú (ít đá, ít đường...)"
                                value={inOrder.note || ''}
                                onChange={(e) => setCustomerOrder(prev => prev.map(oi => oi.itemId === item.id ? { ...oi, note: e.target.value } : oi))}
                                className="text-sm p-3 mt-3 bg-amber-50 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 w-full text-amber-900 placeholder:text-amber-300 font-bold shadow-sm transition-all"
                              />
                            )}
                          </div>
                          <div className="flex justify-end items-center gap-3">
                            {inOrder ? (
                              <div className="flex items-center gap-4 bg-slate-100 rounded-xl px-2 py-1">
                                <button 
                                  onClick={() => setCustomerOrder(prev => prev.map(oi => oi.itemId === item.id ? { ...oi, quantity: Math.max(0, oi.quantity - 1) } : oi).filter(oi => oi.quantity > 0))}
                                  className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-red-600"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="font-bold text-slate-800 w-4 text-center">{inOrder.quantity}</span>
                                <button 
                                  onClick={() => setCustomerOrder(prev => prev.map(oi => oi.itemId === item.id ? { ...oi, quantity: oi.quantity + 1 } : oi))}
                                  className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-emerald-600"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => setCustomerOrder(prev => [...prev, { itemId: item.id, name: item.name, size: 'M', quantity: 1, price: item.basePrice, note: '' }])}
                                className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-100"
                              >
                                <Plus className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </main>

        {/* Floating Cart Summary */}
        {!isOrderSent && customerOrder.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-30">
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tổng cộng ({customerOrder.reduce((sum, item) => sum + item.quantity, 0)} món)</span>
                <span className="text-xl font-black text-slate-800">
                  {formatCurrency(customerOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                </span>
              </div>
              <button 
                onClick={handleSendCustomerOrder}
                className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 active:scale-95 transition-transform"
              >
                GỬI GỌI MÓN
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={48} className="text-emerald-600 animate-spin" />
            <p className="font-bold text-slate-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      )}
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-bottom border-slate-100">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <Coffee size={24} />
          </div>
          <h1 className="hidden lg:block font-bold text-xl tracking-tight text-slate-800">Coffee King’s</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('tables')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'tables' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <LayoutGrid size={20} />
            <span className="hidden lg:block">Sơ đồ bàn</span>
          </button>
          
          {user && (
            <>
              <button 
                onClick={() => setActiveTab('payment')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'payment' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Receipt size={20} />
                <span className="hidden lg:block">Quản lý thanh toán</span>
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'history' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <HistoryIcon size={20} />
                <span className="hidden lg:block">Lịch sử</span>
              </button>
              <button 
                onClick={() => setActiveTab('menu')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'menu' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Settings size={20} />
                <span className="hidden lg:block">Quản lý menu</span>
              </button>
              <button 
                onClick={() => setActiveTab('qr')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'qr' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <PlusCircle size={20} />
                <span className="hidden lg:block">Mã QR Gọi Món</span>
              </button>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="hidden lg:block p-4 bg-slate-50 rounded-xl">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Thống kê nhanh</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Bàn đang dùng</span>
                <span className="font-bold text-amber-600">{tables.filter(t => t.status === 'Serving' || t.status === 'Unpaid').length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Bàn trống</span>
                <span className="font-bold text-emerald-600">{tables.filter(t => t.status === 'Empty').length}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-xl font-bold text-slate-800">
            {activeTab === 'tables' ? 'Quản lý bàn' : activeTab === 'payment' ? 'Quản lý thanh toán' : activeTab === 'history' ? 'Lịch sử thanh toán' : activeTab === 'menu' ? 'Quản lý menu' : 'Mã QR Gọi Món'}
          </h2>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-800">{user.displayName || user.email}</p>
                  <p className="text-xs text-slate-400">{isAdminUser() ? 'Quản trị viên' : 'Nhân viên'}</p>
                </div>
                <button 
                  onClick={() => auth.signOut()}
                  className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  title="Đăng xuất"
                >
                  <X size={20} />
                </button>
                <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                  <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt="avatar" />
                </div>
<<<<<<< HEAD
                {isAdminUser() && (
                  <button 
                    onClick={async () => {
                      if (window.confirm('Bạn có muốn nạp lại menu mặc định không?')) {
                        setIsLoading(true);
                        try {
                          for (const item of MENU_ITEMS) {
                            await apiFetch('/api/menu/update', {
                              method: 'POST',
                              body: item
                            });
                          }
                          await loadMenu();
                          showToast('Nạp menu thành công!', 'success');
                        } catch (error) {
                          showToast('Lỗi khi nạp menu', 'error');
                        } finally {
                          setIsLoading(false);
                        }
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                    title="Nạp menu mặc định"
                  >
                    <PlusCircle size={20} />
                  </button>
                )}
=======
>>>>>>> 045dd41a1f65ebaaeeaaed3435600b34bacdb0ec
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <Users size={18} />
                <span className="text-sm font-semibold">Đăng nhập</span>
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'tables' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {tables.map(table => (
                <motion.button
                  key={table.id}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (!user) {
                      showToast('Vui lòng đăng nhập để quản lý bàn', 'warning');
                      return;
                    }
                    setSelectedTableId(table.id);
                  }}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col items-center gap-4 transition-all hover:shadow-md relative overflow-hidden group"
                >
                  <div className={`absolute top-0 left-0 w-full h-1.5 ${getStatusColor(table.status)}`} />
                  
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${getStatusColor(table.status)} shadow-lg`}>
                    <Users size={24} />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-bold text-lg text-slate-800">Bàn {table.id}</h3>
                    <p className={`text-xs font-semibold uppercase tracking-wider mt-1 ${
                      table.status === 'Empty' ? 'text-emerald-600' : 
                      table.status === 'Serving' ? 'text-amber-600' : 
                      table.status === 'Unpaid' ? 'text-rose-600' : 'text-slate-500'
                    }`}>
                      {getStatusText(table.status)}
                    </p>
                  </div>

                  {table.currentOrder.length > 0 && (
                    <div className="mt-2 w-full pt-3 border-t border-slate-50 flex justify-center items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{table.currentOrder.length} món đã chọn</span>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          ) : activeTab === 'payment' ? (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-slate-800">Bàn chờ thanh toán</h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-slate-500">Đang phục vụ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <span className="text-slate-500">Chờ thanh toán</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tables.filter(t => t.status === 'Serving' || t.status === 'Unpaid').length === 0 ? (
                  <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                    <Receipt size={48} className="mb-4 opacity-20" />
                    <p className="font-medium">Không có bàn nào đang chờ thanh toán</p>
                  </div>
                ) : (
                  tables.filter(t => t.status === 'Serving' || t.status === 'Unpaid').map(table => (
                    <motion.button
                      key={table.id}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedPaymentTableId(table.id)}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-4 text-left group hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${getStatusColor(table.status)} shadow-lg`}>
                            <Users size={24} />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800">Bàn {table.id}</h4>
                            <p className="text-xs text-slate-400">{table.currentOrder.length} món</p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          table.status === 'Serving' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                        }`}>
                          {getStatusText(table.status)}
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-slate-50 flex justify-between items-end">
                        <div className="text-xs text-slate-400 uppercase font-bold tracking-widest">Tạm tính</div>
                        <div className="text-xl font-black text-slate-800">
                          {formatCurrency(table.currentOrder.reduce((s, i) => s + (i.price * i.quantity), 0))}
                        </div>
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            </div>
          ) : activeTab === 'history' ? (
            <div className="max-w-4xl mx-auto space-y-4">
              {history.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <HistoryIcon size={40} />
                  </div>
                  <h3 className="text-lg font-medium text-slate-500">Chưa có lịch sử thanh toán</h3>
                </div>
              ) : (
                history.map(record => (
                  <div key={record.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-bold text-xl">
                        {record.tableId}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-slate-800">Bàn {record.tableId}</h3>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-400">{new Date(record.timestamp).toLocaleString('vi-VN')}</span>
                        </div>
                        <div className="space-y-1">
                          {record.items.map((i, idx) => (
                            <div key={idx} className="text-sm text-slate-500">
                              <span className="font-medium text-slate-700">{i.name} x{i.quantity}</span>
                              {i.note && <div className="mt-1 p-2 bg-amber-50 border border-amber-100 rounded-lg text-sm font-bold text-amber-700 italic">Ghi chú: {i.note}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Tổng cộng</p>
                        <p className="text-lg font-bold text-emerald-600">{formatCurrency(record.total)}</p>
                      </div>
                      <button 
                        onClick={() => deleteHistoryRecord(record.id)}
                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : activeTab === 'menu' ? (
            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[75vh]">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                    <ShoppingCart size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Quản lý Menu ({menuItems.length})</h3>
                </div>
                <div className="flex items-center gap-3">
                  {selectedMenuIds.length > 0 && (
                    <button 
                      type="button"
                      onClick={(e) => { e.preventDefault(); handleDeleteSelected(); }}
                      className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 transition-all shadow-md shadow-rose-100"
                    >
                      <Trash2 size={18} />
                      Xóa {selectedMenuIds.length} món
                    </button>
                  )}
                  <div className="relative">
                    <input 
                      type="file" 
                      id="bulk-upload"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleBulkUpload}
                      className="hidden"
                    />
                    <label 
                      htmlFor="bulk-upload"
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all cursor-pointer"
                    >
                      <Upload size={18} />
                      Tải lên hàng loạt
                    </label>
                  </div>
                  <button 
                    onClick={() => {
                    setIsAddingItem(true);
                    setOriginalImagePath(undefined);
                  }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100"
                  >
                    <PlusCircle size={18} />
                    Thêm món
                  </button>
                </div>
              </div>

              {/* Category Tabs */}
              <div className="px-6 py-2 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
                {MENU_CATEGORIES.map(cat => {
                  const count = cat === 'All' 
                    ? menuItems.length 
                    : menuItems.filter(m => m.category === cat).length;
                  
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setMenuActiveCategory(cat);
                        setSelectedMenuIds([]);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                        menuActiveCategory === cat 
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
                        : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                      <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                        menuActiveCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
                <div className="ml-auto pl-4 flex items-center gap-4">
                  <button 
                    onClick={handleAddMissingItems}
                    className="text-emerald-500 hover:text-emerald-700 text-[10px] font-bold uppercase tracking-wider transition-colors border border-emerald-200 px-2 py-1 rounded-lg"
                  >
                    Thêm món mới từ hệ thống
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => { e.preventDefault(); handleClearAllMenu(); }}
                    className="text-rose-400 hover:text-rose-600 text-[10px] font-bold uppercase tracking-wider transition-colors"
                  >
                    Xóa toàn bộ menu
                  </button>
                </div>
              </div>

              {uploadProgress && (
                <div className="px-6 py-3 bg-emerald-50 border-b border-emerald-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-700 uppercase">Đang tải lên...</span>
                    <span className="text-xs font-bold text-emerald-700">{uploadProgress.current}/{uploadProgress.total}</span>
                  </div>
                  <div className="w-full h-1.5 bg-emerald-200 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-emerald-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-hidden">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider font-bold">
                      <th className="px-6 py-4 w-12 text-center">
                        <button 
                          onClick={toggleSelectAll}
                          className="text-slate-400 hover:text-emerald-600 transition-colors"
                        >
                          {(() => {
                            const filteredItems = menuActiveCategory === 'All' 
                              ? menuItems 
                              : menuItems.filter(m => m.category === menuActiveCategory);
                            
                            return selectedMenuIds.length === filteredItems.length && filteredItems.length > 0 ? (
                              <CheckSquare size={20} className="text-emerald-600" />
                            ) : (
                              <Square size={20} />
                            );
                          })()}
                        </button>
                      </th>
                      <th className="px-6 py-4 w-[calc(50%-48px)]">Tên món</th>
                      <th className="px-6 py-4 w-1/4">Danh mục</th>
                      <th className="px-6 py-4 w-1/4">Giá tiền</th>
                      <th className="px-6 py-4 w-32 text-right">Thao tác</th>
                    </tr>
                  </thead>
                </table>
                <div className="h-[calc(100%-56px)]">
                  <Virtuoso
                    style={{ height: '100%' }}
                    data={menuActiveCategory === 'All' 
                      ? menuItems 
                      : menuItems.filter(m => m.category === menuActiveCategory)
                    }
                    itemContent={(index, item) => (
                      <div key={item.id} className={`flex items-center hover:bg-slate-50/50 transition-colors group border-b border-slate-50 ${selectedMenuIds.includes(item.id) ? 'bg-emerald-50/30' : ''}`}>
                        <div className="px-6 py-4 w-12 text-center">
                          <button 
                            onClick={() => toggleSelectMenu(item.id)}
                            className="text-slate-300 hover:text-emerald-600 transition-colors"
                          >
                            {selectedMenuIds.includes(item.id) ? (
                              <CheckSquare size={20} className="text-emerald-600" />
                            ) : (
                              <Square size={20} />
                            )}
                          </button>
                        </div>
                        <div className="px-6 py-4 w-[calc(50%-48px)]">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center cursor-pointer"
                              onClick={() => item.imageUrl && setIsFullImageOpen(item.imageUrl)}
                            >
                              <LazyImage 
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="font-bold text-slate-700 truncate">{item.name}</span>
                          </div>
                        </div>
                        <div className="px-6 py-4 w-1/4">
                          <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full truncate inline-block max-w-full">{item.category}</span>
                        </div>
                        <div className="px-6 py-4 w-1/4">
                          <span className="font-bold text-emerald-600">{formatCurrency(item.basePrice)}</span>
                        </div>
                        <div className="px-6 py-4 w-32 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => {
                                setEditingItem(item);
                                setOriginalImagePath(item.imagePath);
                              }}
                              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                              title="Chỉnh sửa"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              type="button"
                              onClick={(e) => { e.preventDefault(); handleDeleteItem(item.id); }}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                              title="Xóa"
                            >
                              <Trash2 size={18} />
                            </button>
                            <button 
                              type="button"
                              onClick={(e) => { e.preventDefault(); handlePermanentDelete(item.id); }}
                              className="p-2 text-slate-400 hover:text-rose-800 hover:bg-rose-100 rounded-lg transition-all"
                              title="Xóa vĩnh viễn"
                            >
                              <AlertTriangle size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          ) : activeTab === 'qr' ? (
            <div className="max-w-6xl mx-auto space-y-8 pb-20">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Hệ thống QR Gọi Món</h3>
                <p className="text-slate-500 text-sm">Mỗi bàn có một mã QR riêng. Khách hàng quét mã để xem thực đơn và gọi món trực tiếp từ điện thoại.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tables.map(table => {
                  const getQrUrl = () => {
                    const { origin } = window.location;
                    return `${origin}/customer?table=${table.id}`;
                  };
                  
                  const qrUrl = getQrUrl();

                  const downloadQR = () => {
                    const svg = document.getElementById(`qr-table-${table.id}`);
                    if (!svg) return;
                    
                    const svgData = new XMLSerializer().serializeToString(svg);
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    const img = new Image();
                    
                    img.onload = () => {
                      canvas.width = 1000;
                      canvas.height = 1000;
                      if (ctx) {
                        ctx.fillStyle = "white";
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 50, 50, 900, 900);
                        
                        // Add text
                        ctx.fillStyle = "#1e293b";
                        ctx.font = "bold 40px sans-serif";
                        ctx.textAlign = "center";
                        ctx.fillText(`COFFEE KING'S - BÀN ${table.id}`, 500, 970);
                        
                        const pngFile = canvas.toDataURL("image/png");
                        const downloadLink = document.createElement("a");
                        downloadLink.download = `QR_Ban_${table.id}.png`;
                        downloadLink.href = pngFile;
                        downloadLink.click();
                      }
                    };
                    
                    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
                  };

                  return (
                    <motion.div 
                      key={table.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-4 hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-center w-full mb-2">
                        <span className="text-lg font-bold text-slate-800">Bàn {table.id}</span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          table.status === 'Empty' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {table.status === 'Empty' ? 'Trống' : 'Đang dùng'}
                        </span>
                      </div>
                      
                      <div className="bg-white p-4 rounded-2xl border-4 border-slate-50 shadow-inner group-hover:scale-105 transition-transform">
                        <QRCodeSVG 
                          id={`qr-table-${table.id}`}
                          value={qrUrl} 
                          size={160} 
                          level="H" 
                          includeMargin={true} 
                        />
                      </div>
                      
                      <div className="w-full space-y-2 mt-2">
                        <p className="text-[10px] text-slate-400 text-center break-all font-mono bg-slate-50 p-2 rounded-lg">
                          {qrUrl}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(qrUrl);
                              showToast('Đã sao chép liên kết', 'success');
                            }}
                            className="py-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
                          >
                            <Copy size={14} />
                            Sao chép
                          </button>
                          <button 
                            onClick={downloadQR}
                            className="py-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                          >
                            <Download size={14} />
                            Tải ảnh
                          </button>
                        </div>
                        <button 
                          onClick={() => window.open(qrUrl, '_blank')}
                          className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                        >
                          <Search size={16} />
                          Xem thử
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </main>

      {/* Menu Edit Modal */}
      <AnimatePresence>
        {(editingItem || isAddingItem) && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { 
                setEditingItem(null); 
                setIsAddingItem(false); 
                setOriginalImagePath(undefined);
              }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                {isAddingItem ? 'Thêm món mới' : 'Chỉnh sửa món'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tên món</label>
                  <input 
                    type="text" 
                    value={isAddingItem ? newItem.name : editingItem?.name}
                    onChange={(e) => isAddingItem ? setNewItem({...newItem, name: e.target.value}) : setEditingItem({...editingItem!, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                    placeholder="Nhập tên món..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Danh mục</label>
                  <select 
                    value={isAddingItem ? newItem.category : editingItem?.category}
                    onChange={(e) => isAddingItem ? setNewItem({...newItem, category: e.target.value}) : setEditingItem({...editingItem!, category: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                  >
                    {MENU_CATEGORIES.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Giá tiền (VNĐ)</label>
                  <input 
                    type="number" 
                    value={isAddingItem ? newItem.basePrice : editingItem?.basePrice}
                    onChange={(e) => isAddingItem ? setNewItem({...newItem, basePrice: parseInt(e.target.value)}) : setEditingItem({...editingItem!, basePrice: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mô tả món</label>
                  <textarea 
                    value={isAddingItem ? newItem.description : editingItem?.description}
                    onChange={(e) => isAddingItem ? setNewItem({...newItem, description: e.target.value}) : setEditingItem({...editingItem!, description: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium min-h-[80px]"
                    placeholder="Nhập mô tả món..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Hình ảnh món nước</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="w-32 h-32 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-200 relative group">
                      {(previewUrl || (isAddingItem ? newItem.imageUrl : editingItem?.imageUrl)) ? (
                        <>
                          <img 
                            src={previewUrl || (isAddingItem ? newItem.imageUrl : editingItem?.imageUrl)} 
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <button 
                            type="button"
                            onClick={() => removeImage(isAddingItem)}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                          >
                            <Trash2 size={20} />
                          </button>
                        </>
                      ) : (
                        <div className="text-slate-300 flex flex-col items-center gap-1">
                          <ImageOff size={24} />
                          <span className="text-[10px] font-bold uppercase">Trống</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 w-full space-y-3">
                      <div className="relative">
                        <input 
                          type="file" 
                          id="image-upload"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => handleImageUpload(e, isAddingItem)}
                          className="hidden"
                        />
                        <label 
                          htmlFor="image-upload"
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-emerald-50 text-emerald-600 rounded-xl cursor-pointer hover:bg-emerald-100 transition-colors font-bold text-xs border border-emerald-100"
                        >
                          <Upload size={16} />
                          Tải hình ảnh lên
                        </label>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-400 font-medium italic">
                          * Chấp nhận: JPG, PNG, WEBP.
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Hoặc dán URL:</span>
                          <input 
                            type="text" 
                            value={isAddingItem ? newItem.imageUrl : editingItem?.imageUrl}
                            onChange={(e) => isAddingItem ? setNewItem({...newItem, imageUrl: e.target.value}) : setEditingItem({...editingItem!, imageUrl: e.target.value})}
                            className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-[10px]"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => { 
                    setEditingItem(null); 
                    setIsAddingItem(false); 
                    setOriginalImagePath(undefined);
                  }}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => isAddingItem ? handleAddItem() : handleUpdateItem(editingItem!)}
                  disabled={isSaving}
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {isSaving ? 'Đang lưu...' : 'Lưu lại'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Modal */}
      <AnimatePresence>
        {selectedTableId !== null && activeTable && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTableId(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-6xl h-[90dvh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row"
              >
                {/* Mobile Tab Switcher */}
                <div className="lg:hidden flex border-b border-slate-100 shrink-0">
                  <button 
                    onClick={() => setOrderModalTab('menu')}
                    className={`flex-1 py-4 text-sm font-bold transition-all ${orderModalTab === 'menu' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50' : 'text-slate-500'}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Coffee size={18} />
                      Thực đơn
                    </div>
                  </button>
                  <button 
                    onClick={() => setOrderModalTab('order')}
                    className={`flex-1 py-4 text-sm font-bold transition-all ${orderModalTab === 'order' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50' : 'text-slate-500'}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ShoppingCart size={18} />
                      Đơn hàng ({activeTable.currentOrder.length})
                    </div>
                  </button>
                </div>

                {/* Menu Section */}
                <div className={`w-full lg:w-[40%] flex-col min-w-0 min-h-0 border-r border-slate-100 ${orderModalTab === 'menu' ? 'flex flex-1' : 'hidden lg:flex'}`}>
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedTableId(null)}
                      className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
                    >
                      <X size={20} />
                    </button>
                    <h3 className="text-xl font-bold text-slate-800">Gọi món - Bàn {activeTable.id}</h3>
                  </div>
                  
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Tìm món..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar border-b border-slate-50">
                  {MENU_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat === 'All' ? 'All' : cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                        (selectedCategory === 'All' && cat === 'All') || selectedCategory === cat 
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <VirtuosoGrid
                    style={{ height: '100%' }}
                    data={filteredMenu}
                    totalCount={filteredMenu.length}
                    listClassName="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
                    itemContent={(index, item) => (
                      <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-3 flex flex-col gap-3 hover:shadow-md transition-shadow h-full">
                        <div 
                          className="relative h-32 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center cursor-pointer"
                          onClick={() => item.imageUrl && setIsFullImageOpen(item.imageUrl)}
                        >
                          <LazyImage 
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-emerald-600">
                            {formatCurrency(item.basePrice)}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 truncate">{item.name}</h4>
                          <p className="text-xs text-slate-400">{item.category}</p>
                        </div>
                        <div className="flex gap-1 mt-auto">
                          <button
                            onClick={() => addToOrder(activeTable.id, item)}
                            className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-100 flex items-center justify-center gap-2"
                          >
                            <Plus size={14} />
                            Thêm món
                          </button>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* Order Summary Section */}
              <div className={`w-full lg:w-[60%] bg-slate-50 flex-col min-h-0 ${orderModalTab === 'order' ? 'flex flex-1' : 'hidden lg:flex'}`}>
                <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={20} className="text-emerald-600" />
                    <h4 className="font-bold text-slate-800">Đơn hàng</h4>
                  </div>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-wider">
                    {getStatusText(activeTable.status)}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                  {activeTable.currentOrder.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 opacity-60">
                      <Receipt size={48} />
                      <p className="text-sm font-medium">Chưa có món nào được chọn</p>
                    </div>
                  ) : (
                    activeTable.currentOrder.map((item, idx) => (
                      <div key={`${item.itemId}-${item.size}-${idx}`} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex flex-col">
                            <h5 className="font-bold text-slate-800 truncate">{item.name}</h5>
                            {item.note && (
                              <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-sm font-black text-amber-700 italic shadow-sm">
                                Ghi chú: {item.note}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-slate-100 rounded-xl p-1">
                            <button 
                              onClick={() => updateQuantity(activeTable.id, item.itemId, -1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-lg transition-colors text-slate-500"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-slate-700">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(activeTable.id, item.itemId, 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-lg transition-colors text-slate-500"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-6 bg-white border-t border-slate-200 space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {activeTable.status === 'Paid' ? (
                      <button 
                        onClick={() => resetTable(activeTable.id)}
                        className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-all shadow-lg shadow-slate-200"
                      >
                        <CheckCircle2 size={20} />
                        Dọn bàn (Trống)
                      </button>
                    ) : (
                      <>
                        <button 
                          disabled={activeTable.currentOrder.length === 0}
                          onClick={() => handleConfirmOrder(activeTable.id)}
                          className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:shadow-none"
                        >
                          <CheckCircle2 size={20} />
                          Xác nhận gọi món
                        </button>
                        {activeTable.status === 'Serving' && (
                          <button 
                            onClick={() => handleRequestPayment(activeTable.id)}
                            className="w-full py-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-rose-100 transition-all"
                          >
                            <Clock size={18} />
                            Yêu cầu thanh toán
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Payment Modal */}
      <AnimatePresence>
        {selectedPaymentTableId !== null && activePaymentTable && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPaymentTableId(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${getStatusColor(activePaymentTable.status)} shadow-lg`}>
                    <Receipt size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Thanh toán - Bàn {activePaymentTable.id}</h3>
                </div>
                <button 
                  onClick={() => setSelectedPaymentTableId(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[60vh]">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-50">
                  <span>Món đã gọi</span>
                  <span>Thành tiền</span>
                </div>
                {activePaymentTable.currentOrder.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div>
                      <h5 className="font-bold text-slate-700">{item.name}</h5>
                      <p className="text-xs text-slate-400">x{item.quantity} • {formatCurrency(item.price)}</p>
                      {item.note && (
                        <div className="mt-2 p-2 bg-amber-50 border border-amber-100 rounded-lg text-sm font-bold text-amber-700 italic">
                          Ghi chú: {item.note}
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-slate-800">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-slate-500">
                    <span>Tạm tính</span>
                    <span className="font-medium">{formatCurrency(activePaymentTable.currentOrder.reduce((s, i) => s + (i.price * i.quantity), 0))}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Thời gian</span>
                    <span className="font-medium">{new Date().toLocaleTimeString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between items-end pt-4 border-t border-slate-200">
                    <span className="text-lg font-bold text-slate-800">Tổng cộng</span>
                    <span className="text-3xl font-black text-emerald-600">
                      {formatCurrency(activePaymentTable.currentOrder.reduce((s, i) => s + (i.price * i.quantity), 0))}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => handleCheckout(activePaymentTable.id)}
                  className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100"
                >
                  <Receipt size={24} />
                  XÁC NHẬN THANH TOÁN
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Full Image Modal */}
      <AnimatePresence>
        {isFullImageOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFullImageOpen(null)}
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center"
            >
              <button 
                onClick={() => setIsFullImageOpen(null)}
                className="absolute -top-12 right-0 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={32} />
              </button>
              <div className="w-full h-full rounded-3xl overflow-hidden bg-slate-800 shadow-2xl">
                <LazyImage 
                  src={isFullImageOpen}
                  alt="Full view"
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm.show && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm({ ...deleteConfirm, show: false })}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden p-8 text-center"
            >
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {deleteConfirm.type === 'permanent' ? 'XÓA VĨNH VIỄN MÓN' : 'Xác nhận xóa'}
              </h3>
              <p className="text-slate-500 text-sm mb-8">
                {deleteConfirm.type === 'single' ? (
                  <>Bạn có chắc chắn muốn xóa món <span className="font-bold text-slate-800">"{deleteConfirm.name}"</span>? Hành động này không thể hoàn tác.</>
                ) : deleteConfirm.type === 'bulk' ? (
                  <>Bạn có chắc chắn muốn xóa <span className="font-bold text-slate-800">{deleteConfirm.count} món</span> đã chọn? Hành động này không thể hoàn tác.</>
                ) : deleteConfirm.type === 'permanent' ? (
                  <span className="text-rose-600 font-bold">Bạn đang xóa vĩnh viễn món này. Hành động không thể hoàn tác.</span>
                ) : (
                  <>CẢNH BÁO NGUY HIỂM: Bạn sắp xóa <span className="font-bold text-rose-600 uppercase">toàn bộ menu</span>. Bạn có chắc chắn?</>
                )}
              </p>

              {deleteConfirm.type === 'permanent' && (
                <div className="mb-8 text-left">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nhập tên món để xác nhận:</label>
                  <input 
                    type="text"
                    value={confirmInput}
                    onChange={(e) => setConfirmInput(e.target.value)}
                    placeholder={deleteConfirm.name}
                    className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-rose-500 transition-all"
                    autoFocus
                  />
                </div>
              )}
              
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={(e) => { e.preventDefault(); setDeleteConfirm({ ...deleteConfirm, show: false }); }}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="button"
                  onClick={(e) => { e.preventDefault(); confirmDelete(); }}
                  className={`flex-1 py-4 text-white rounded-2xl font-bold transition-all shadow-lg ${
                    deleteConfirm.type === 'permanent' 
                    ? 'bg-rose-800 hover:bg-rose-900 shadow-rose-200' 
                    : 'bg-rose-600 hover:bg-rose-700 shadow-rose-100'
                  }`}
                >
                  {deleteConfirm.type === 'permanent' ? 'XÓA VĨNH VIỄN' : 'Xác nhận xóa'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-8 left-1/2 z-[200] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border ${
              toast.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' :
              toast.type === 'warning' ? 'bg-amber-500 border-amber-400 text-white' :
              'bg-rose-600 border-rose-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
            <span className="font-bold text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
