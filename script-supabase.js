// Supabase 配置
const SUPABASE_URL = 'https://mkeabsltkvfilsushefl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rZWFic2x0a3ZmaWxzdXNoZWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MzY5MjMsImV4cCI6MjA2NDQxMjkyM30.mlJqJPr_nmMZWyZ5JCkwZZyB-Z6vpuVhG091FJomrqw';

// 初始化 Supabase 客户端
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 爱情开始时间
const loveStartTime = new Date('2023-09-26T19:00:00');

// 状态管理
let isConnected = false;

// 初始化应用
document.addEventListener('DOMContentLoaded', async function() {
    console.log('应用开始初始化...');
    
    // 测试数据库连接
    await testConnection();
    
    // 启动爱情计数器
    updateLoveCounter();
    setInterval(updateLoveCounter, 1000);
    
    // 加载所有数据
    await loadAllData();
    
    // 设置照片上传监听器
    setupPhotoUpload();
    
    console.log('应用初始化完成');
});

// 测试数据库连接
async function testConnection() {
    try {
        updateStatus('连接数据库中...', 'connecting');
        
        // 测试连接 - 尝试获取messages表的数据
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .limit(1);
            
        if (error) {
            console.error('数据库连接错误:', error);
            updateStatus('数据库连接失败', 'error');
            isConnected = false;
            
            // 如果表不存在，给出创建提示
            if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
                updateStatus('需要创建数据表', 'warning');
                showDatabaseSetupInfo();
            }
        } else {
            console.log('数据库连接成功');
            updateStatus('数据库已连接', 'connected');
            isConnected = true;
        }
    } catch (err) {
        console.error('连接测试失败:', err);
        updateStatus('连接失败', 'error');
        isConnected = false;
    }
}

// 显示数据库设置信息
function showDatabaseSetupInfo() {
    const setupInfo = `
    <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 8px;">
        <h3>🔧 需要设置数据库表</h3>
        <p>请在 Supabase 中创建以下三个表：</p>
        <ol>
            <li><strong>messages</strong> 表：id (int8, 主键), author (text), content (text), created_at (timestamptz)</li>
            <li><strong>photos</strong> 表：id (int8, 主键), url (text), description (text), created_at (timestamptz)</li>
            <li><strong>memories</strong> 表：id (int8, 主键), title (text), content (text), date (date), created_at (timestamptz)</li>
        </ol>
        <p>创建完成后刷新页面即可正常使用。</p>
    </div>`;
    
    document.querySelector('.container').insertAdjacentHTML('afterbegin', setupInfo);
}

// 更新状态指示器
function updateStatus(text, type) {
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    
    statusText.textContent = text;
    statusIndicator.className = `status-indicator ${type}`;
}

// 更新爱情计数器
function updateLoveCounter() {
    const now = new Date();
    const timeDiff = now - loveStartTime;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
}

// 加载所有数据
async function loadAllData() {
    if (!isConnected) {
        console.log('数据库未连接，跳过数据加载');
        return;
    }
    
    try {
        await Promise.all([
            loadMessages(),
            loadPhotos(),
            loadMemories()
        ]);
        console.log('所有数据加载完成');
    } catch (error) {
        console.error('加载数据时出错:', error);
    }
}

// 加载留言
async function loadMessages() {
    try {
        const { data: messages, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('加载留言失败:', error);
            return;
        }

        const messageList = document.getElementById('messageList');
        messageList.innerHTML = '';

        messages.forEach(message => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message-item';
            messageDiv.innerHTML = `
                <div class="message-header">
                    <span class="message-author">${message.author}</span>
                    <span class="message-time">${formatDateTime(message.created_at)}</span>
                    <button onclick="deleteMessage(${message.id})" class="delete-btn">删除</button>
                </div>
                <div class="message-content">${message.content}</div>
            `;
            messageList.appendChild(messageDiv);
        });

        console.log(`加载了 ${messages.length} 条留言`);
    } catch (error) {
        console.error('加载留言时出错:', error);
    }
}

// 添加留言
async function addMessage() {
    const author = document.getElementById('messageAuthor').value;
    const content = document.getElementById('messageInput').value.trim();

    if (!author) {
        alert('请选择作者');
        return;
    }

    if (!content) {
        alert('请输入留言内容');
        return;
    }

    if (!isConnected) {
        alert('数据库未连接，无法保存留言');
        return;
    }

    try {
        const { data, error } = await supabase
            .from('messages')
            .insert([
                {
                    author: author,
                    content: content,
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) {
            console.error('添加留言失败:', error);
            alert('留言发送失败，请重试');
            return;
        }

        console.log('留言添加成功:', data);
        
        // 清空输入框
        document.getElementById('messageInput').value = '';
        document.getElementById('messageAuthor').value = '';
        
        // 重新加载留言
        await loadMessages();
        
    } catch (error) {
        console.error('添加留言时出错:', error);
        alert('留言发送失败，请重试');
    }
}

// 删除留言
async function deleteMessage(messageId) {
    if (!confirm('确定要删除这条留言吗？')) {
        return;
    }

    if (!isConnected) {
        alert('数据库未连接，无法删除留言');
        return;
    }

    try {
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', messageId);

        if (error) {
            console.error('删除留言失败:', error);
            alert('删除失败，请重试');
            return;
        }

        console.log('留言删除成功');
        await loadMessages();
        
    } catch (error) {
        console.error('删除留言时出错:', error);
        alert('删除失败，请重试');
    }
}

// 设置照片上传监听器
function setupPhotoUpload() {
    const photoInput = document.getElementById('photoInput');
    photoInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            // 预览选中的文件
            const reader = new FileReader();
            reader.onload = function(e) {
                console.log('照片已选择:', file.name);
            };
            reader.readAsDataURL(file);
        }
    });
}

// 上传照片
async function uploadPhoto() {
    const photoInput = document.getElementById('photoInput');
    const description = document.getElementById('photoDescription').value.trim();
    const file = photoInput.files[0];

    if (!file) {
        alert('请先选择照片');
        return;
    }

    if (!description) {
        alert('请为照片添加描述');
        return;
    }

    if (!isConnected) {
        alert('数据库未连接，无法上传照片');
        return;
    }

    try {
        // 生成唯一文件名
        const fileExt = file.name.split('.').pop();
        const fileName = `photo_${Date.now()}.${fileExt}`;
        
        // 上传文件到 Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('photos') // 需要在 Supabase 中创建 'photos' bucket
            .upload(fileName, file);

        if (uploadError) {
            console.error('文件上传失败:', uploadError);
            
            // 如果bucket不存在，使用base64存储
            if (uploadError.message.includes('bucket') || uploadError.message.includes('not found')) {
                console.log('Storage bucket不存在，使用base64存储');
                await uploadPhotoAsBase64(file, description);
                return;
            }
            
            alert('照片上传失败，请重试');
            return;
        }

        // 获取公共URL
        const { data: urlData } = supabase.storage
            .from('photos')
            .getPublicUrl(fileName);

        // 保存照片信息到数据库
        const { data, error } = await supabase
            .from('photos')
            .insert([
                {
                    url: urlData.publicUrl,
                    description: description,
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) {
            console.error('保存照片信息失败:', error);
            alert('照片信息保存失败，请重试');
            return;
        }

        console.log('照片上传成功:', data);
        
        // 清空输入
        photoInput.value = '';
        document.getElementById('photoDescription').value = '';
        
        // 重新加载照片
        await loadPhotos();
        
    } catch (error) {
        console.error('上传照片时出错:', error);
        alert('照片上传失败，请重试');
    }
}

// 使用base64上传照片（备用方案）
async function uploadPhotoAsBase64(file, description) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const base64Data = e.target.result;
                
                const { data, error } = await supabase
                    .from('photos')
                    .insert([
                        {
                            url: base64Data,
                            description: description,
                            created_at: new Date().toISOString()
                        }
                    ])
                    .select();

                if (error) {
                    console.error('保存照片失败:', error);
                    alert('照片保存失败，请重试');
                    reject(error);
                    return;
                }

                console.log('照片保存成功（base64）:', data);
                
                // 清空输入
                document.getElementById('photoInput').value = '';
                document.getElementById('photoDescription').value = '';
                
                // 重新加载照片
                await loadPhotos();
                resolve(data);
                
            } catch (err) {
                console.error('处理照片时出错:', err);
                reject(err);
            }
        };
        reader.readAsDataURL(file);
    });
}

// 加载照片
async function loadPhotos() {
    try {
        const { data: photos, error } = await supabase
            .from('photos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('加载照片失败:', error);
            return;
        }

        const photoGrid = document.getElementById('photoGrid');
        photoGrid.innerHTML = '';

        photos.forEach(photo => {
            const photoDiv = document.createElement('div');
            photoDiv.className = 'photo-item';
            photoDiv.innerHTML = `
                <img src="${photo.url}" alt="${photo.description}" onclick="viewPhoto('${photo.url}', '${photo.description}')">
                <div class="photo-info">
                    <p class="photo-description">${photo.description}</p>
                    <span class="photo-date">${formatDateTime(photo.created_at)}</span>
                    <button onclick="deletePhoto(${photo.id})" class="delete-btn">删除</button>
                </div>
            `;
            photoGrid.appendChild(photoDiv);
        });

        console.log(`加载了 ${photos.length} 张照片`);
    } catch (error) {
        console.error('加载照片时出错:', error);
    }
}

// 查看照片
function viewPhoto(url, description) {
    const modal = document.createElement('div');
    modal.className = 'photo-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <img src="${url}" alt="${description}">
            <p>${description}</p>
        </div>
    `;
    document.body.appendChild(modal);
}

// 删除照片
async function deletePhoto(photoId) {
    if (!confirm('确定要删除这张照片吗？')) {
        return;
    }

    if (!isConnected) {
        alert('数据库未连接，无法删除照片');
        return;
    }

    try {
        const { error } = await supabase
            .from('photos')
            .delete()
            .eq('id', photoId);

        if (error) {
            console.error('删除照片失败:', error);
            alert('删除失败，请重试');
            return;
        }

        console.log('照片删除成功');
        await loadPhotos();
        
    } catch (error) {
        console.error('删除照片时出错:', error);
        alert('删除失败，请重试');
    }
}

// 加载回忆
async function loadMemories() {
    try {
        const { data: memories, error } = await supabase
            .from('memories')
            .select('*')
            .order('date', { ascending: false });

        if (error) {
            console.error('加载回忆失败:', error);
            return;
        }

        const memoryList = document.getElementById('memoryList');
        memoryList.innerHTML = '';

        memories.forEach(memory => {
            const memoryDiv = document.createElement('div');
            memoryDiv.className = 'memory-item';
            memoryDiv.innerHTML = `
                <div class="memory-header">
                    <h3 class="memory-title">${memory.title}</h3>
                    <div class="memory-actions">
                        <span class="memory-date">${formatDate(memory.date)}</span>
                        <button onclick="deleteMemory(${memory.id})" class="delete-btn">删除</button>
                    </div>
                </div>
                <div class="memory-content">${memory.content}</div>
            `;
            memoryList.appendChild(memoryDiv);
        });

        console.log(`加载了 ${memories.length} 个回忆`);
    } catch (error) {
        console.error('加载回忆时出错:', error);
    }
}

// 添加回忆
async function addMemory() {
    const title = document.getElementById('memoryTitle').value.trim();
    const content = document.getElementById('memoryContent').value.trim();
    const date = document.getElementById('memoryDate').value;

    if (!title || !content || !date) {
        alert('请填写完整的回忆信息');
        return;
    }

    if (!isConnected) {
        alert('数据库未连接，无法保存回忆');
        return;
    }

    try {
        const { data, error } = await supabase
            .from('memories')
            .insert([
                {
                    title: title,
                    content: content,
                    date: date,
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) {
            console.error('添加回忆失败:', error);
            alert('回忆保存失败，请重试');
            return;
        }

        console.log('回忆添加成功:', data);
        
        // 清空输入框
        document.getElementById('memoryTitle').value = '';
        document.getElementById('memoryContent').value = '';
        document.getElementById('memoryDate').value = '';
        
        // 重新加载回忆
        await loadMemories();
        
    } catch (error) {
        console.error('添加回忆时出错:', error);
        alert('回忆保存失败，请重试');
    }
}

// 删除回忆
async function deleteMemory(memoryId) {
    if (!confirm('确定要删除这个回忆吗？')) {
        return;
    }

    if (!isConnected) {
        alert('数据库未连接，无法删除回忆');
        return;
    }

    try {
        const { error } = await supabase
            .from('memories')
            .delete()
            .eq('id', memoryId);

        if (error) {
            console.error('删除回忆失败:', error);
            alert('删除失败，请重试');
            return;
        }

        console.log('回忆删除成功');
        await loadMemories();
        
    } catch (error) {
        console.error('删除回忆时出错:', error);
        alert('删除失败，请重试');
    }
}

// 格式化日期时间
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl+Enter 发送留言
    if (e.ctrlKey && e.key === 'Enter') {
        const messageInput = document.getElementById('messageInput');
        if (document.activeElement === messageInput) {
            addMessage();
        }
    }
});

// 导出数据功能
async function exportData() {
    if (!isConnected) {
        alert('数据库未连接，无法导出数据');
        return;
    }

    try {
        const [messagesResult, photosResult, memoriesResult] = await Promise.all([
            supabase.from('messages').select('*').order('created_at', { ascending: true }),
            supabase.from('photos').select('*').order('created_at', { ascending: true }),
            supabase.from('memories').select('*').order('date', { ascending: true })
        ]);

        const exportData = {
            messages: messagesResult.data || [],
            photos: photosResult.data || [],
            memories: memoriesResult.data || [],
            exportTime: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `love-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('数据导出成功！');
    } catch (error) {
        console.error('导出数据失败:', error);
        alert('数据导出失败，请重试');
    }
}

// 全局错误处理
window.addEventListener('error', function(e) {
    console.error('全局错误:', e.error);
    updateStatus('发生错误', 'error');
});

// 网络状态监听
window.addEventListener('online', function() {
    console.log('网络已连接');
    testConnection();
});

window.addEventListener('offline', function() {
    console.log('网络已断开');
    updateStatus('网络断开', 'error');
    isConnected = false;
}); 